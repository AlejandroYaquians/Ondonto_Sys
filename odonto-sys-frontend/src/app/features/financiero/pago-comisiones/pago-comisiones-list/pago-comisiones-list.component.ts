import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { PagoComisionService } from '../../../../core/services/pago-comision.service';
import { ComisionAcumulada } from '../../../../core/models/pago-comision.models';

@Component({
  selector: 'app-pago-comisiones-list',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './pago-comisiones-list.component.html',
  styleUrl: './pago-comisiones-list.component.scss'
})
export class PagoComisionesListComponent implements OnInit {
  private readonly pagoComisionService = inject(PagoComisionService);

  protected readonly items = signal<ComisionAcumulada[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargando.set(true);
    this.pagoComisionService.listarAcumulado().subscribe({
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

  formatoFecha(fecha: string | null): string {
    if (!fecha) {
      return '-';
    }
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }
}
