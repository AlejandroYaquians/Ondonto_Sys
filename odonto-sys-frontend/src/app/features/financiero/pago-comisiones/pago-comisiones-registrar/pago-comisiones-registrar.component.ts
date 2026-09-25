import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PagoComisionService } from '../../../../core/services/pago-comision.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { CobroService } from '../../../../core/services/cobro.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { NotificacionService } from '../../../../core/services/notificacion.service';
import { Comision, Cobro } from '../../../../core/models/cobro.models';
import { Doctor } from '../../../../core/models/doctor.models';
import { Paciente } from '../../../../core/models/paciente.models';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function ayerIso(): string {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const mes = String(ayer.getMonth() + 1).padStart(2, '0');
  const dia = String(ayer.getDate()).padStart(2, '0');
  return `${ayer.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-pago-comisiones-registrar',
  imports: [RouterLink, ReactiveFormsModule, DecimalPipe],
  templateUrl: './pago-comisiones-registrar.component.html'
})
export class PagoComisionesRegistrarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pagoComisionService = inject(PagoComisionService);
  private readonly doctorService = inject(DoctorService);
  private readonly cobroService = inject(CobroService);
  private readonly pacienteService = inject(PacienteService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly idDoctor = Number(this.route.snapshot.paramMap.get('idDoctor'));
  protected readonly maximaFecha = hoyIso();
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly pendientes = signal<Comision[]>([]);
  protected readonly cobros = signal<Cobro[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly fechaCorte = signal(ayerIso());

  protected readonly formulario = this.fb.nonNullable.group({
    fechaCorte: [ayerIso()],
    numeroReferencia: ['']
  });

  protected readonly comisionesIncluidas = computed(() =>
    this.pendientes().filter((item) => item.fecha <= this.fechaCorte())
  );

  protected readonly totalAPagar = computed(() =>
    this.comisionesIncluidas().reduce((total, item) => total + item.montoComision, 0)
  );

  protected readonly rangoFechas = computed(() => {
    const items = this.comisionesIncluidas();
    if (items.length === 0) {
      return null;
    }
    const fechas = items.map((item) => item.fecha).sort();
    return { desde: fechas[0], hasta: fechas[fechas.length - 1] };
  });

  ngOnInit(): void {
    this.doctorService.buscarPorId(this.idDoctor).subscribe((datos) => this.doctor.set(datos));
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos));

    this.pagoComisionService.listarPendientes(this.idDoctor).subscribe({
      next: (datos) => {
        this.pendientes.set(datos);
        this.cargarCobros(datos);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  private cargarCobros(comisiones: Comision[]): void {
    const idsUnicos = [...new Set(comisiones.map((item) => item.idCobro))];
    if (idsUnicos.length === 0) {
      this.cargando.set(false);
      return;
    }

    forkJoin(idsUnicos.map((id) => this.cobroService.buscarPorId(id))).subscribe({
      next: (datos) => {
        this.cobros.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  cobroDe(idCobro: number): Cobro | undefined {
    return this.cobros().find((cobro) => cobro.idCobro === idCobro);
  }

  nombrePaciente(idCobro: number): string {
    const cobro = this.cobroDe(idCobro);
    if (!cobro) {
      return '—';
    }
    const paciente = this.pacientes().find((p) => p.idPaciente === cobro.idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : `#${cobro.idPaciente}`;
  }

  cambiarFechaCorte(valor: string): void {
    this.fechaCorte.set(valor);
  }

  fechaDiaMesAnio(fechaIso: string): string {
    const [anio, mes, dia] = fechaIso.split('-');
    return `${dia}-${mes}-${anio}`;
  }

  confirmarPago(): void {
    this.guardando.set(true);
    this.error.set(null);

    const numeroReferencia = this.formulario.controls.numeroReferencia.value.trim() || null;

    this.pagoComisionService.registrarPago(this.idDoctor, { fechaCorte: this.fechaCorte(), numeroReferencia }).subscribe({
      next: () => {
        this.notificacionService.exito('Pago registrado.');
        this.router.navigateByUrl('/financiero/pago-comisiones');
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al registrar el pago.');
      }
    });
  }
}
