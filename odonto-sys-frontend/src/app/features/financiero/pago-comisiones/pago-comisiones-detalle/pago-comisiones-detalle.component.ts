import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PagoComisionService } from '../../../../core/services/pago-comision.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { Comision } from '../../../../core/models/cobro.models';
import { Doctor } from '../../../../core/models/doctor.models';

@Component({
  selector: 'app-pago-comisiones-detalle',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './pago-comisiones-detalle.component.html'
})
export class PagoComisionesDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pagoComisionService = inject(PagoComisionService);
  private readonly doctorService = inject(DoctorService);

  protected readonly idDoctor = Number(this.route.snapshot.paramMap.get('idDoctor'));
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly items = signal<Comision[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly totalAcumulado = computed(() =>
    this.items().reduce((total, item) => total + item.montoComision, 0)
  );

  ngOnInit(): void {
    this.doctorService.buscarPorId(this.idDoctor).subscribe((datos) => this.doctor.set(datos));

    this.pagoComisionService.listarPendientes(this.idDoctor).subscribe({
      next: (datos) => {
        this.items.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  fechaDiaMesAnio(fechaIso: string): string {
    const [anio, mes, dia] = fechaIso.split('-');
    return `${dia}-${mes}-${anio}`;
  }
}
