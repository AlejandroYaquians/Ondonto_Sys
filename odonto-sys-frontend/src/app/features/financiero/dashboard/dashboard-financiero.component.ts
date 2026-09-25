import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import { ReporteFinancieroService } from '../../../core/services/reporte-financiero.service';
import { CobroService } from '../../../core/services/cobro.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { ESTILO_TABLA_PDF, PdfService } from '../../../core/services/pdf.service';
import { ExcelService } from '../../../core/services/excel.service';
import { ReporteFinanciero } from '../../../core/models/reporte-financiero.models';
import { Cobro } from '../../../core/models/cobro.models';
import { Paciente } from '../../../core/models/paciente.models';

type Periodo = 'hoy' | 'semana' | 'mes' | 'personalizado';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function sumarDias(fechaIso: string, dias: number): string {
  const fecha = new Date(`${fechaIso}T00:00:00`);
  fecha.setDate(fecha.getDate() + dias);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

function primerDiaDelMesIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-01`;
}

function inicioSemanaIso(fechaIso: string): string {
  const fecha = new Date(`${fechaIso}T00:00:00`);
  const diaSemana = fecha.getDay();
  const offsetHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  return sumarDias(fechaIso, offsetHastaLunes);
}

function finSemanaIso(fechaIso: string): string {
  return sumarDias(inicioSemanaIso(fechaIso), 6);
}

@Component({
  selector: 'app-dashboard-financiero',
  imports: [RouterLink, ReactiveFormsModule, DecimalPipe],
  templateUrl: './dashboard-financiero.component.html'
})
export class DashboardFinancieroComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reporteService = inject(ReporteFinancieroService);
  private readonly cobroService = inject(CobroService);
  private readonly pacienteService = inject(PacienteService);
  private readonly pdfService = inject(PdfService);
  private readonly excelService = inject(ExcelService);

  protected readonly periodo = signal<Periodo>('hoy');
  protected readonly reporte = signal<ReporteFinanciero | null>(null);
  protected readonly cobrosRecientes = signal<Cobro[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly descargando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly filtroPersonalizado = this.fb.group({
    desde: [hoyIso()],
    hasta: [hoyIso()]
  });

  ngOnInit(): void {
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos));
    this.cargar();
  }

  private rangoDelPeriodo(): { desde: string; hasta: string } {
    const hoy = hoyIso();
    switch (this.periodo()) {
      case 'hoy':
        return { desde: hoy, hasta: hoy };
      case 'semana':
        return { desde: inicioSemanaIso(hoy), hasta: finSemanaIso(hoy) };
      case 'mes':
        return { desde: primerDiaDelMesIso(), hasta: hoy };
      case 'personalizado': {
        const valores = this.filtroPersonalizado.getRawValue();
        return { desde: valores.desde ?? hoy, hasta: valores.hasta ?? hoy };
      }
    }
  }

  cambiarPeriodo(periodo: Periodo): void {
    this.periodo.set(periodo);
    if (periodo !== 'personalizado') {
      this.cargar();
    }
  }

  aplicarPersonalizado(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    const { desde, hasta } = this.rangoDelPeriodo();

    this.reporteService.generar(desde, hasta).subscribe({
      next: (datos) => {
        this.reporte.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });

    this.cobroService.listarPorRango(desde, hasta, null, null).subscribe((cobros) => {
      this.cobrosRecientes.set(cobros.sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5));
    });
  }

  fechaParaVerTodos(): string {
    const primerCobro = this.cobrosRecientes()[0];
    return primerCobro ? primerCobro.fecha.slice(0, 10) : hoyIso();
  }

  nombrePaciente(idPaciente: number): string {
    const paciente = this.pacientes().find((p) => p.idPaciente === idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : `#${idPaciente}`;
  }

  formatoFecha(fecha: string): string {
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }

  async exportarExcel(): Promise<void> {
    const r = this.reporte();
    if (!r) {
      return;
    }
    const { desde, hasta } = this.rangoDelPeriodo();

    this.descargando.set(true);

    try {
      const { workbook, hoja } = this.excelService.crearLibro('Reporte Financiero', `Período: ${desde} al ${hasta}`);
      let fila = 5;

      fila = this.excelService.agregarSeccion(hoja, fila, 'Resumen de cobros');
      fila = this.excelService.agregarTabla(
        hoja,
        fila,
        ['Concepto', 'Monto'],
        [
          ['Ingresos brutos', r.ingresosBrutos],
          ['Efectivo', r.cobroEfectivo],
          ['Tarjeta', r.cobroTarjeta],
          ['Transferencia', r.cobroTransferencia],
          ['Comisión bancaria', r.comisionBancaria],
          ['Costo de laboratorio', r.costoLaboratorio],
          ['Monto neto', r.montoNeto]
        ],
        [1]
      );

      fila = this.excelService.agregarSeccion(hoja, fila, 'Comisiones por doctor');
      fila = this.excelService.agregarTabla(
        hoja,
        fila,
        ['Doctor', 'Porcentaje', 'Monto comisión'],
        r.comisionesPorDoctor.length === 0
          ? [['No hay comisiones en este período.', '', '']]
          : r.comisionesPorDoctor.map((item) => [item.nombreDoctor, `${item.porcentaje}%`, item.montoComision]),
        [2]
      );

      fila = this.excelService.agregarSeccion(hoja, fila, 'Gastos del período');
      fila = this.excelService.agregarTabla(
        hoja,
        fila,
        ['Concepto', 'Monto'],
        [
          ['Gastos fijos', r.gastosFijos],
          ['Gastos variables', r.gastosVariables],
          ['Comisiones a doctores', r.totalComisiones]
        ],
        [1]
      );

      fila = this.excelService.agregarSeccion(hoja, fila, 'Balance del período');
      this.excelService.agregarTabla(hoja, fila, ['Concepto', 'Monto'], [['Balance del período', r.gananciaNeta]], [1]);

      await this.excelService.descargar(workbook, `Reporte_Financiero_${desde}_${hasta}.xlsx`);
      this.descargando.set(false);
    } catch {
      this.error.set('Error al exportar.');
      this.descargando.set(false);
    }
  }

  async exportarPdf(): Promise<void> {
    const r = this.reporte();
    if (!r) {
      return;
    }
    const { desde, hasta } = this.rangoDelPeriodo();

    const { doc, primeraLineaY } = await this.pdfService.crearDocumento('Reporte Financiero');
    let y = primeraLineaY;

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: y,
      columnStyles: { 0: { fontStyle: 'bold' } },
      body: [['Período', `${desde} al ${hasta}`]]
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Resumen de cobros', 14, y);
    y += 4;

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: y,
      columnStyles: { 0: { fontStyle: 'bold' } },
      body: [
        ['Ingresos brutos', `Q${r.ingresosBrutos.toFixed(2)}`],
        ['Efectivo', `Q${r.cobroEfectivo.toFixed(2)}`],
        ['Tarjeta', `Q${r.cobroTarjeta.toFixed(2)}`],
        ['Transferencia', `Q${r.cobroTransferencia.toFixed(2)}`],
        ['Comisión bancaria', `Q${r.comisionBancaria.toFixed(2)}`],
        ['Costo de laboratorio', `Q${r.costoLaboratorio.toFixed(2)}`],
        ['Monto neto', `Q${r.montoNeto.toFixed(2)}`]
      ]
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Comisiones por doctor', 14, y);
    y += 4;

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: y,
      head: [['Doctor', 'Porcentaje', 'Monto comisión']],
      body:
        r.comisionesPorDoctor.length === 0
          ? [['No hay comisiones en este período.', '', '']]
          : r.comisionesPorDoctor.map((item) => [item.nombreDoctor, `${item.porcentaje}%`, `Q${item.montoComision.toFixed(2)}`])
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Gastos del período', 14, y);
    y += 4;

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: y,
      columnStyles: { 0: { fontStyle: 'bold' } },
      body: [
        ['Gastos fijos', `Q${r.gastosFijos.toFixed(2)}`],
        ['Gastos variables', `Q${r.gastosVariables.toFixed(2)}`],
        ['Comisiones a doctores', `Q${r.totalComisiones.toFixed(2)}`]
      ]
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: y,
      styles: { ...ESTILO_TABLA_PDF.styles, fontStyle: 'bold' },
      body: [['Balance del período', `Q${r.gananciaNeta.toFixed(2)}`]]
    });

    this.pdfService.abrir(doc, `Reporte_Financiero_${desde}_${hasta}.pdf`);
  }
}
