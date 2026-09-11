import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import { ReporteFinancieroService } from '../../../core/services/reporte-financiero.service';
import { PdfService } from '../../../core/services/pdf.service';
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
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './cierre-caja.component.html'
})
export class CierreCajaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reporteService = inject(ReporteFinancieroService);
  private readonly pdfService = inject(PdfService);

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

  async exportarPdf(): Promise<void> {
    const r = this.reporte();
    if (!r) {
      return;
    }
    const valores = this.filtros.getRawValue();
    const desde = valores.desde ?? primerDiaDelMesIso();
    const hasta = valores.hasta ?? hoyIso();

    const { doc, primeraLineaY } = await this.pdfService.crearDocumento('Reporte Financiero');
    let y = primeraLineaY;

    autoTable(doc, {
      startY: y,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: 'bold' } },
      body: [['Período', `${desde} al ${hasta}`]]
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Resumen de cobros', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: 'bold' } },
      body: [
        ['Total cobrado', `Q${r.ingresosBrutos.toFixed(2)}`],
        ['Total comisión bancaria', `Q${r.comisionBancaria.toFixed(2)}`],
        ['Total costo laboratorio', `Q${r.costoLaboratorio.toFixed(2)}`],
        ['Monto neto', `Q${r.montoNeto.toFixed(2)}`]
      ]
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Comisiones por doctor', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Doctor', 'Porcentaje', 'Monto comisión']],
      body:
        r.comisionesPorDoctor.length === 0
          ? [['No hay comisiones en este período.', '', '']]
          : r.comisionesPorDoctor.map((item) => [item.nombreDoctor, `${item.porcentaje}%`, `Q${item.montoComision.toFixed(2)}`])
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Gastos del período', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: 'bold' } },
      body: [
        ['Gastos fijos', `Q${r.gastosFijos.toFixed(2)}`],
        ['Gastos variables', `Q${r.gastosVariables.toFixed(2)}`]
      ]
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: y,
      theme: 'plain',
      styles: { fontSize: 12, fontStyle: 'bold' },
      body: [['Ganancia neta', `Q${r.gananciaNeta.toFixed(2)}`]]
    });

    this.pdfService.abrir(doc, `reporte-financiero-${desde}-${hasta}.pdf`);
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
        enlace.download = `Reporte_Financiero_${desde}_${hasta}.csv`;
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
