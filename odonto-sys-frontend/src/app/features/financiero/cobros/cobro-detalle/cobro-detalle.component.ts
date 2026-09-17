import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import autoTable from 'jspdf-autotable';
import { CobroService } from '../../../../core/services/cobro.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { NotificacionService } from '../../../../core/services/notificacion.service';
import { ESTILO_TABLA_PDF, PdfService } from '../../../../core/services/pdf.service';
import { Cobro } from '../../../../core/models/cobro.models';
import { Paciente } from '../../../../core/models/paciente.models';
import { Doctor } from '../../../../core/models/doctor.models';
import { CatMetodoPago, Servicio } from '../../../../core/models/catalogo.models';

@Component({
  selector: 'app-cobro-detalle',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cobro-detalle.component.html'
})
export class CobroDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cobroService = inject(CobroService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly pdfService = inject(PdfService);

  protected readonly cobro = signal<Cobro | null>(null);
  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly metodosPago = signal<CatMetodoPago[]>([]);
  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.catalogosService.metodosPago().subscribe((datos) => this.metodosPago.set(datos));
    this.catalogosService.servicios().subscribe((datos) => this.servicios.set(datos));

    this.cobroService.buscarPorId(id).subscribe({
      next: (cobro) => {
        this.cobro.set(cobro);
        this.pacienteService.buscarPorId(cobro.idPaciente).subscribe((datos) => this.paciente.set(datos));
        if (cobro.idDoctor) {
          this.doctorService.buscarPorId(cobro.idDoctor).subscribe((datos) => this.doctor.set(datos));
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreServicio(idServicio: number | null): string {
    if (!idServicio) {
      return '-';
    }
    return this.servicios().find((s) => s.idServicio === idServicio)?.nombre ?? `#${idServicio}`;
  }

  nombreMetodoPago(id: number): string {
    return this.metodosPago().find((m) => m.idMetodoPago === id)?.nombre ?? `#${id}`;
  }

  formatoFecha(fecha: string): string {
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }

  async imprimir(): Promise<void> {
    const datosCobro = this.cobro();
    if (!datosCobro) {
      return;
    }

    const { doc, primeraLineaY } = await this.pdfService.crearDocumento('Comprobante de Cobro');

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: primeraLineaY,
      columnStyles: { 0: { fontStyle: 'bold' } },
      body: [
        ['Código de cobro', datosCobro.codigoCobro],
        ['Fecha', this.formatoFecha(datosCobro.fecha)],
        ['Paciente', this.paciente() ? `${this.paciente()!.nombre} ${this.paciente()!.apellido}` : '-'],
        ['Doctor', this.doctor() ? `Dr(a). ${this.doctor()!.nombre} ${this.doctor()!.apellido}` : '-'],
        ['Servicio', this.nombreServicio(datosCobro.idServicio)],
        ['Método de pago', this.nombreMetodoPago(datosCobro.idMetodoPago)],
        ['Estado', datosCobro.estado]
      ]
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: finalY + 8,
      head: [['Concepto', 'Monto']],
      body: [
        ['Monto bruto', datosCobro.montoBruto !== null ? `Q${datosCobro.montoBruto.toFixed(2)}` : '-'],
        ['Comisión bancaria', datosCobro.comisionTarjeta !== null ? `Q${datosCobro.comisionTarjeta.toFixed(2)}` : '-'],
        ['Costo de laboratorio', datosCobro.costoLaboratorio !== null ? `Q${datosCobro.costoLaboratorio.toFixed(2)}` : '-'],
        ['Monto neto', datosCobro.montoNeto !== null ? `Q${datosCobro.montoNeto.toFixed(2)}` : '-']
      ]
    });

    this.pdfService.abrir(doc, `Comprobante_Cobro_${datosCobro.codigoCobro}.pdf`);
  }

  anular(): void {
    const cobro = this.cobro();
    if (!cobro || !window.confirm('¿Desea anular este cobro?')) {
      return;
    }
    this.cobroService.cambiarEstado(cobro.idCobro, 'Anulado').subscribe({
      next: (actualizado) => {
        this.cobro.set(actualizado);
        this.notificacionService.exito('Cobro anulado.');
      },
      error: () => this.error.set('Error al guardar.')
    });
  }
}
