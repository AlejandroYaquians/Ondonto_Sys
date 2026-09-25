import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import autoTable from 'jspdf-autotable';
import { HistorialClinicoCobroService } from '../../../core/services/historial-clinico-cobro.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { ESTILO_TABLA_PDF, PdfService } from '../../../core/services/pdf.service';
import { HistorialClinicoCobroResponse } from '../../../core/models/historial-clinico-cobro.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';
import { CatMetodoPago, Servicio } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-historial-clinico-form',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './historial-clinico-form.component.html'
})
export class HistorialClinicoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly historialClinicoCobroService = inject(HistorialClinicoCobroService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly pdfService = inject(PdfService);
  private readonly route = inject(ActivatedRoute);

  protected readonly idCita = signal<number | null>(null);
  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly metodosPago = signal<CatMetodoPago[]>([]);

  protected readonly mostrarReceta = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly resultado = signal<HistorialClinicoCobroResponse | null>(null);

  protected readonly formulario = this.fb.group({
    idPaciente: [null as number | null, Validators.required],
    idDoctor: [null as number | null, Validators.required],
    descripcion: [''],
    medicamento: [''],
    dosis: [''],
    frecuencia: [''],
    duracion: [''],
    indicaciones: [''],
    idServicio: [null as number | null, Validators.required],
    costoLaboratorio: [null as number | null],
    metodoPago: [null as number | null, Validators.required],
    montoUnico: [null as number | null],
    montoEfectivo: [null as number | null],
    montoTarjeta: [null as number | null],
    montoTransferencia: [null as number | null]
  });

  private readonly idDoctorSeleccionado = toSignal(this.formulario.controls.idDoctor.valueChanges, {
    initialValue: null as number | null
  });

  private readonly idServicioSeleccionado = toSignal(this.formulario.controls.idServicio.valueChanges, {
    initialValue: null as number | null
  });

  private readonly metodoPagoSeleccionado = toSignal(this.formulario.controls.metodoPago.valueChanges, {
    initialValue: null as number | null
  });

  private readonly montoUnicoValor = toSignal(this.formulario.controls.montoUnico.valueChanges, {
    initialValue: null as number | null
  });

  private readonly montoEfectivoValor = toSignal(this.formulario.controls.montoEfectivo.valueChanges, {
    initialValue: null as number | null
  });

  private readonly montoTarjetaValor = toSignal(this.formulario.controls.montoTarjeta.valueChanges, {
    initialValue: null as number | null
  });

  private readonly montoTransferenciaValor = toSignal(this.formulario.controls.montoTransferencia.valueChanges, {
    initialValue: null as number | null
  });

  private readonly costoLaboratorioValor = toSignal(this.formulario.controls.costoLaboratorio.valueChanges, {
    initialValue: null as number | null
  });

  protected readonly doctorSeleccionado = computed(() => {
    const doctorFijo = this.doctor();
    if (doctorFijo) {
      return doctorFijo;
    }
    return this.doctores().find((d) => d.idDoctor === this.idDoctorSeleccionado()) ?? null;
  });

  protected readonly servicioSeleccionado = computed(() =>
    this.servicios().find((s) => s.idServicio === this.idServicioSeleccionado()) ?? null
  );

  protected readonly idMetodoMixto = computed(
    () => this.metodosPago().find((m) => m.nombre.toLowerCase() === 'mixto')?.idMetodoPago ?? null
  );

  protected readonly esMixto = computed(
    () => this.metodoPagoSeleccionado() !== null && this.metodoPagoSeleccionado() === this.idMetodoMixto()
  );

  protected readonly metodoUnicoSeleccionado = computed(() => {
    const valor = this.metodoPagoSeleccionado();
    if (valor === null || valor === this.idMetodoMixto()) {
      return null;
    }
    return this.metodosPago().find((m) => m.idMetodoPago === valor) ?? null;
  });

  private readonly bucketMetodoUnico = computed<'efectivo' | 'tarjeta' | 'transferencia' | null>(() => {
    const metodo = this.metodoUnicoSeleccionado();
    if (!metodo) {
      return null;
    }
    const nombre = metodo.nombre.toLowerCase();
    if (nombre === 'tarjeta') {
      return 'tarjeta';
    }
    if (nombre === 'transferencia') {
      return 'transferencia';
    }
    return 'efectivo';
  });

  protected readonly previaCobro = computed(() => {
    let efectivo = 0;
    let tarjeta = 0;
    let transferencia = 0;
    let porcentajeBanco = 0;

    if (this.esMixto()) {
      efectivo = this.montoEfectivoValor() ?? 0;
      tarjeta = this.montoTarjetaValor() ?? 0;
      transferencia = this.montoTransferenciaValor() ?? 0;
      const tarjetaCat = this.metodosPago().find((m) => m.nombre.toLowerCase() === 'tarjeta');
      porcentajeBanco = tarjetaCat?.comisionPorcentaje ?? 0;
    } else {
      const monto = this.montoUnicoValor() ?? 0;
      const bucket = this.bucketMetodoUnico();
      if (bucket === 'tarjeta') {
        tarjeta = monto;
        porcentajeBanco = this.metodoUnicoSeleccionado()?.comisionPorcentaje ?? 0;
      } else if (bucket === 'transferencia') {
        transferencia = monto;
      } else {
        efectivo = monto;
      }
    }

    const costoLaboratorio = this.costoLaboratorioValor() ?? 0;
    const porcentajeDoctor = this.doctorSeleccionado()?.porcentajeComision ?? 0;

    const montoBruto = efectivo + tarjeta + transferencia;
    const comisionTarjeta = Math.round(tarjeta * (porcentajeBanco / 100) * 100) / 100;
    const montoNeto = montoBruto - comisionTarjeta - costoLaboratorio;
    const comisionDoctor = Math.round(montoNeto * (porcentajeDoctor / 100) * 100) / 100;

    return { montoBruto, comisionTarjeta, montoNeto, comisionDoctor };
  });

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParamMap;
    const idCita = queryParams.get('idCita');
    const idPaciente = queryParams.get('idPaciente');
    const idDoctor = queryParams.get('idDoctor');

    if (idCita) {
      this.idCita.set(Number(idCita));
    }

    if (idPaciente) {
      const id = Number(idPaciente);
      this.formulario.controls.idPaciente.setValue(id);
      this.pacienteService.buscarPorId(id).subscribe((datos) => this.paciente.set(datos));
    } else {
      this.pacienteService.listarActivos().subscribe((datos) => this.pacientes.set(datos));
    }

    if (idDoctor) {
      const id = Number(idDoctor);
      this.formulario.controls.idDoctor.setValue(id);
      this.doctorService.buscarPorId(id).subscribe((datos) => this.doctor.set(datos));
    } else {
      this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));
    }

    this.catalogosService.servicios().subscribe((datos) => this.servicios.set(datos));
    this.catalogosService.metodosPago().subscribe((datos) => this.metodosPago.set(datos));
  }

  toggleReceta(): void {
    this.mostrarReceta.update((actual) => !actual);
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const idMetodoPago = valores.metodoPago;

    let montoEfectivo: number | null = null;
    let montoTarjeta: number | null = null;
    let montoTransferencia: number | null = null;

    if (this.esMixto()) {
      montoEfectivo = valores.montoEfectivo;
      montoTarjeta = valores.montoTarjeta;
      montoTransferencia = valores.montoTransferencia;
    } else {
      const bucket = this.bucketMetodoUnico();
      if (bucket === 'tarjeta') {
        montoTarjeta = valores.montoUnico;
      } else if (bucket === 'transferencia') {
        montoTransferencia = valores.montoUnico;
      } else {
        montoEfectivo = valores.montoUnico;
      }
    }

    this.historialClinicoCobroService
      .registrar({
        idCita: this.idCita(),
        idPaciente: valores.idPaciente as number,
        idDoctor: valores.idDoctor as number,
        descripcion: valores.descripcion ?? '',
        medicamento: this.mostrarReceta() ? valores.medicamento || null : null,
        dosis: this.mostrarReceta() ? valores.dosis || null : null,
        frecuencia: this.mostrarReceta() ? valores.frecuencia || null : null,
        duracion: this.mostrarReceta() ? valores.duracion || null : null,
        indicaciones: this.mostrarReceta() ? valores.indicaciones || null : null,
        idServicio: valores.idServicio as number,
        costoLaboratorio: valores.costoLaboratorio,
        idMetodoPago,
        montoEfectivo,
        montoTarjeta,
        montoTransferencia
      })
      .subscribe({
        next: (respuesta) => {
          this.guardando.set(false);
          this.resultado.set(respuesta);
          this.notificacionService.exito('Consulta registrada.');
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(err?.error?.mensaje ?? 'Error al guardar.');
        }
      });
  }

  private resolverPaciente(): Paciente | null {
    return this.paciente() ?? this.pacientes().find((p) => p.idPaciente === this.formulario.controls.idPaciente.value) ?? null;
  }

  private filasPago(): (string | number)[][] {
    if (this.esMixto()) {
      const filas: (string | number)[][] = [];
      const efectivo = this.montoEfectivoValor() ?? 0;
      const tarjeta = this.montoTarjetaValor() ?? 0;
      const transferencia = this.montoTransferenciaValor() ?? 0;
      if (efectivo > 0) {
        filas.push(['Efectivo', `Q${efectivo.toFixed(2)}`]);
      }
      if (tarjeta > 0) {
        filas.push(['Tarjeta', `Q${tarjeta.toFixed(2)}`]);
      }
      if (transferencia > 0) {
        filas.push(['Transferencia', `Q${transferencia.toFixed(2)}`]);
      }
      return filas;
    }
    const monto = this.montoUnicoValor() ?? 0;
    return [[this.metodoUnicoSeleccionado()?.nombre ?? '-', `Q${monto.toFixed(2)}`]];
  }

  async imprimir(): Promise<void> {
    const comprobante = this.resultado();
    if (!comprobante) {
      return;
    }

    const paciente = this.resolverPaciente();
    const doctor = this.doctorSeleccionado();
    const servicio = this.servicioSeleccionado();

    const { doc, primeraLineaY } = await this.pdfService.crearDocumento('Comprobante de Cobro');

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: primeraLineaY,
      columnStyles: { 0: { fontStyle: 'bold' } },
      body: [
        ['Código de cobro', comprobante.codigoCobro],
        ['Paciente', paciente ? `${paciente.nombre} ${paciente.apellido}` : '-'],
        ['Doctor', doctor ? `Dr(a). ${doctor.nombre} ${doctor.apellido}` : '-']
      ]
    });

    const finalYEncabezado = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: finalYEncabezado + 8,
      head: [['Servicio']],
      body: [[servicio?.nombre ?? '-']]
    });

    const finalYServicio = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    const filasPago = this.filasPago();
    if (filasPago.length > 1) {
      filasPago.push(['Total', `Q${comprobante.montoBruto.toFixed(2)}`]);
    }

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: finalYServicio + 8,
      head: [['Forma de pago', 'Monto']],
      body: filasPago
    });

    this.pdfService.abrir(doc, `Comprobante_Cobro_${comprobante.codigoCobro}.pdf`);
  }
}
