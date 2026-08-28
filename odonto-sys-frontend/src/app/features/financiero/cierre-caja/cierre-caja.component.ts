import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ReporteFinancieroService } from '../../../core/services/reporte-financiero.service';
import { ReporteFinanciero } from '../../../core/models/reporte-financiero.models';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function primerDiaDelMesIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-01`;
}

@Component({
  selector: 'app-cierre-caja',
  imports: [ReactiveFormsModule],
  templateUrl: './cierre-caja.component.html'
})
export class CierreCajaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reporteService = inject(ReporteFinancieroService);

  protected readonly reporte = signal<ReporteFinanciero | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly descargando = signal(false);

  protected readonly filtros = this.fb.group({
    desde: [primerDiaDelMesIso()],
    hasta: [hoyIso()]
  });

  ngOnInit(): void {
    this.generar();
  }

  generar(): void {
    this.cargando.set(true);
    this.error.set(null);
    const valores = this.filtros.getRawValue();
    const desde = valores.desde ?? primerDiaDelMesIso();
    const hasta = valores.hasta ?? hoyIso();

    this.reporteService.generar(desde, hasta).subscribe({
      next: (datos) => {
        this.reporte.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al generar el reporte.');
        this.cargando.set(false);
      }
    });
  }

  exportarPdf(): void {
    window.print();
  }

  exportarExcel(): void {
    const valores = this.filtros.getRawValue();
    const desde = valores.desde ?? primerDiaDelMesIso();
    const hasta = valores.hasta ?? hoyIso();

    this.descargando.set(true);
    this.reporteService.descargarCsv(desde, hasta).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `cierre_caja_${desde}_${hasta}.csv`;
        enlace.click();
        window.URL.revokeObjectURL(url);
        this.descargando.set(false);
      },
      error: () => {
        this.error.set('Error al exportar.');
        this.descargando.set(false);
      }
    });
  }
}
