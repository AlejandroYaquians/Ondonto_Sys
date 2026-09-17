import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PagoComisionService } from '../../../../core/services/pago-comision.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { NotificacionService } from '../../../../core/services/notificacion.service';
import { Comision } from '../../../../core/models/cobro.models';
import { Doctor } from '../../../../core/models/doctor.models';

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
  private readonly notificacionService = inject(NotificacionService);

  protected readonly idDoctor = Number(this.route.snapshot.paramMap.get('idDoctor'));
  protected readonly maximaFecha = hoyIso();
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly pendientes = signal<Comision[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly fechaCorte = signal(ayerIso());

  protected readonly formulario = this.fb.nonNullable.group({
    fechaCorte: [ayerIso()]
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

    this.pagoComisionService.listarPendientes(this.idDoctor).subscribe({
      next: (datos) => {
        this.pendientes.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
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

    this.pagoComisionService.registrarPago(this.idDoctor, { fechaCorte: this.fechaCorte() }).subscribe({
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
