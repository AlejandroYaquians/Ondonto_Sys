import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PagoComisionService } from '../../../../core/services/pago-comision.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { CobroService } from '../../../../core/services/cobro.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { Comision, Cobro } from '../../../../core/models/cobro.models';
import { Doctor } from '../../../../core/models/doctor.models';
import { Paciente } from '../../../../core/models/paciente.models';

@Component({
  selector: 'app-pago-comisiones-detalle',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './pago-comisiones-detalle.component.html'
})
export class PagoComisionesDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pagoComisionService = inject(PagoComisionService);
  private readonly doctorService = inject(DoctorService);
  private readonly cobroService = inject(CobroService);
  private readonly pacienteService = inject(PacienteService);

  protected readonly idDoctor = Number(this.route.snapshot.paramMap.get('idDoctor'));
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly items = signal<Comision[]>([]);
  protected readonly cobros = signal<Cobro[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly totalAcumulado = computed(() =>
    this.items().reduce((total, item) => total + item.montoComision, 0)
  );

  ngOnInit(): void {
    this.doctorService.buscarPorId(this.idDoctor).subscribe((datos) => this.doctor.set(datos));
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos));

    this.pagoComisionService.listarPendientes(this.idDoctor).subscribe({
      next: (datos) => {
        this.items.set(datos);
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

  fechaDiaMesAnio(fechaIso: string): string {
    const [anio, mes, dia] = fechaIso.split('-');
    return `${dia}-${mes}-${anio}`;
  }
}
