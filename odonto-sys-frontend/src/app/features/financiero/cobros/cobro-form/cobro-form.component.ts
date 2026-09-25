import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CobroService } from '../../../../core/services/cobro.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { NotificacionService } from '../../../../core/services/notificacion.service';
import { CobroRequest } from '../../../../core/models/cobro.models';
import { Paciente } from '../../../../core/models/paciente.models';
import { Doctor } from '../../../../core/models/doctor.models';
import { CatMetodoPago, Servicio } from '../../../../core/models/catalogo.models';
import { BuscadorSelectComponent } from '../../../../shared/buscador-select/buscador-select.component';

@Component({
  selector: 'app-cobro-form',
  imports: [ReactiveFormsModule, RouterLink, BuscadorSelectComponent, DecimalPipe],
  templateUrl: './cobro-form.component.html'
})
export class CobroFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cobroService = inject(CobroService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly router = inject(Router);

  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly metodosPago = signal<CatMetodoPago[]>([]);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly opcionesPacientes = computed(() =>
    this.pacientes().map((p) => ({ valor: p.idPaciente, etiqueta: `${p.nombre} ${p.apellido}` }))
  );

  protected readonly formulario = this.fb.group({
    idPaciente: [null as number | null, Validators.required],
    idDoctor: [null as number | null, Validators.required],
    idServicio: [null as number | null, Validators.required],
    precioAplicado: [0, [Validators.required, Validators.min(0)]],
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

  protected readonly doctorSeleccionado = computed(() =>
    this.doctores().find((d) => d.idDoctor === this.idDoctorSeleccionado()) ?? null
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
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos.filter((p) => p.activo)));
    this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));
    this.catalogosService.servicios().subscribe((datos) => this.servicios.set(datos));
    this.catalogosService.metodosPago().subscribe((datos) => this.metodosPago.set(datos));

    this.formulario.controls.idServicio.valueChanges.subscribe((idServicio) => {
      const servicio = this.servicios().find((s) => s.idServicio === idServicio);
      if (servicio) {
        this.formulario.controls.precioAplicado.setValue(servicio.costoBase);
      }
    });
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

    const request: CobroRequest = {
      idPaciente: valores.idPaciente as number,
      idDoctor: valores.idDoctor as number,
      idCita: null,
      idServicio: valores.idServicio as number,
      precioAplicado: valores.precioAplicado as number,
      costoLaboratorio: valores.costoLaboratorio,
      idMetodoPago,
      montoEfectivo,
      montoTransferencia,
      montoTarjeta
    };

    this.cobroService.crear(request).subscribe({
      next: (cobro) => {
        this.notificacionService.exito('Cobro registrado.');
        this.router.navigateByUrl(`/cobros/${cobro.idCobro}`);
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje ?? 'Error al guardar.');
      }
    });
  }
}
