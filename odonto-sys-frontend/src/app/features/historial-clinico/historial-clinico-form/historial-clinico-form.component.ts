import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HistorialClinicoCobroService } from '../../../core/services/historial-clinico-cobro.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { HistorialClinicoCobroResponse } from '../../../core/models/historial-clinico-cobro.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';
import { CatMetodoPago, Servicio } from '../../../core/models/catalogo.models';

const MIXTO = 'mixto';
type MetodoPagoForma = number | typeof MIXTO;

@Component({
  selector: 'app-historial-clinico-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './historial-clinico-form.component.html'
})
export class HistorialClinicoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly historialClinicoCobroService = inject(HistorialClinicoCobroService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
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
    descripcion: ['', Validators.required],
    medicamento: [''],
    dosis: [''],
    frecuencia: [''],
    duracion: [''],
    indicaciones: [''],
    idServicio: [null as number | null, Validators.required],
    costoLaboratorio: [null as number | null],
    metodoPago: [null as MetodoPagoForma | null, Validators.required],
    montoUnico: [null as number | null],
    montoEfectivo: [null as number | null],
    montoTarjeta: [null as number | null]
  });

  private readonly idDoctorSeleccionado = toSignal(this.formulario.controls.idDoctor.valueChanges, {
    initialValue: null as number | null
  });

  private readonly idServicioSeleccionado = toSignal(this.formulario.controls.idServicio.valueChanges, {
    initialValue: null as number | null
  });

  private readonly metodoPagoSeleccionado = toSignal(this.formulario.controls.metodoPago.valueChanges, {
    initialValue: null as MetodoPagoForma | null
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

  protected readonly esMixto = computed(() => this.metodoPagoSeleccionado() === MIXTO);

  protected readonly metodoUnicoSeleccionado = computed(() => {
    const valor = this.metodoPagoSeleccionado();
    if (valor === null || valor === MIXTO) {
      return null;
    }
    return this.metodosPago().find((m) => m.idMetodoPago === valor) ?? null;
  });

  protected readonly metodoUnicoTieneComision = computed(
    () => (this.metodoUnicoSeleccionado()?.comisionPorcentaje ?? 0) > 0
  );

  protected readonly previaCobro = computed(() => {
    let efectivo = 0;
    let tarjeta = 0;
    let porcentajeBanco = 0;

    if (this.esMixto()) {
      efectivo = this.montoEfectivoValor() ?? 0;
      tarjeta = this.montoTarjetaValor() ?? 0;
      const tarjetaCat = this.metodosPago().find((m) => (m.comisionPorcentaje ?? 0) > 0);
      porcentajeBanco = tarjetaCat?.comisionPorcentaje ?? 0;
    } else {
      const monto = this.montoUnicoValor() ?? 0;
      if (this.metodoUnicoTieneComision()) {
        tarjeta = monto;
        porcentajeBanco = this.metodoUnicoSeleccionado()?.comisionPorcentaje ?? 0;
      } else {
        efectivo = monto;
      }
    }

    const costoLaboratorio = this.costoLaboratorioValor() ?? 0;
    const porcentajeDoctor = this.doctorSeleccionado()?.porcentajeComision ?? 0;

    const montoBruto = efectivo + tarjeta;
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
    const metodoPago = valores.metodoPago;

    let idMetodoPago: number | null = null;
    let montoEfectivo: number | null = null;
    let montoTarjeta: number | null = null;

    if (metodoPago === MIXTO) {
      montoEfectivo = valores.montoEfectivo;
      montoTarjeta = valores.montoTarjeta;
    } else {
      idMetodoPago = metodoPago;
      if (this.metodoUnicoTieneComision()) {
        montoTarjeta = valores.montoUnico;
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
        montoTarjeta
      })
      .subscribe({
        next: (respuesta) => {
          this.guardando.set(false);
          this.resultado.set(respuesta);
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(err?.error?.mensaje ?? 'Error al guardar.');
        }
      });
  }

  imprimir(): void {
    window.print();
  }
}
