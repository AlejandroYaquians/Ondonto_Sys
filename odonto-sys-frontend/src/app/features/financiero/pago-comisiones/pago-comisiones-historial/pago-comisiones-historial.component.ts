import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PagoComisionService } from '../../../../core/services/pago-comision.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { PagoComision } from '../../../../core/models/pago-comision.models';
import { Doctor } from '../../../../core/models/doctor.models';

@Component({
  selector: 'app-pago-comisiones-historial',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './pago-comisiones-historial.component.html'
})
export class PagoComisionesHistorialComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pagoComisionService = inject(PagoComisionService);
  private readonly doctorService = inject(DoctorService);

  protected readonly idDoctor = Number(this.route.snapshot.paramMap.get('idDoctor'));
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly items = signal<PagoComision[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.doctorService.buscarPorId(this.idDoctor).subscribe((datos) => this.doctor.set(datos));

    this.pagoComisionService.historialPagos(this.idDoctor).subscribe({
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

  formatoFecha(fecha: string): string {
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }

  fechaDiaMesAnio(fechaIso: string): string {
    const [anio, mes, dia] = fechaIso.split('-');
    return `${dia}-${mes}-${anio}`;
  }
}
