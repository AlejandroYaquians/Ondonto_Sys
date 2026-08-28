import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AuthService } from '../../../core/services/auth.service';
import { CitaRequest } from '../../../core/models/cita.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';
import { CatMotivoCita } from '../../../core/models/catalogo.models';
import { BuscadorSelectComponent } from '../../../shared/buscador-select/buscador-select.component';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

const ESTADO_ATENDIDA = 'Atendida';

@Component({
  selector: 'app-cita-form',
  imports: [ReactiveFormsModule, RouterLink, BuscadorSelectComponent],
  templateUrl: './cita-form.component.html'
})
export class CitaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly citaService = inject(CitaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly idCita = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly estadoActual = signal<string | null>(null);
  protected readonly avisoProximidad = signal<string | null>(null);

  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly motivos = signal<CatMotivoCita[]>([]);

  protected readonly noEditable = computed(() => this.estadoActual() === ESTADO_ATENDIDA);

  protected readonly opcionesPacientes = computed(() =>
    this.pacientes().map((paciente) => ({
      valor: paciente.idPaciente,
      etiqueta: `${paciente.nombre} ${paciente.apellido}`
    }))
  );

  protected readonly formulario = this.fb.group({
    idPaciente: [null as number | null, Validators.required],
    idDoctor: [null as number | null, Validators.required],
    idMotivoCita: [null as number | null, Validators.required],
    fecha: [hoyIso(), Validators.required],
    hora: ['', Validators.required],
    observaciones: ['']
  });

  ngOnInit(): void {
    if (this.authService.rol() === 'DOCTOR') {
      this.router.navigateByUrl('/citas');
      return;
    }

    this.pacienteService.listarActivos().subscribe((datos) => this.pacientes.set(datos));
    this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));
    this.catalogosService.motivosCita().subscribe((datos) => this.motivos.set(datos));

    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idCita.set(id);
      this.cargarCita(id);
    }
  }

  private cargarCita(id: number): void {
    this.cargando.set(true);
    this.citaService.buscarPorId(id).subscribe({
      next: (cita) => {
        this.formulario.patchValue({
          fecha: cita.fecha,
          hora: cita.hora?.slice(0, 5) ?? '',
          observaciones: cita.observaciones ?? '',
          idMotivoCita: cita.idMotivoCita,
          idPaciente: cita.idPaciente,
          idDoctor: cita.idDoctor
        });
        this.catalogosService.estadosCita().subscribe((estados) => {
          const nombre = estados.find((e) => e.idEstadoCita === cita.idEstadoCita)?.nombre ?? null;
          this.estadoActual.set(nombre);
          if (nombre === ESTADO_ATENDIDA) {
            this.formulario.disable();
          }
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.noEditable()) {
      return;
    }
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const idUsuario = this.authService.idUsuario();
    if (!idUsuario) {
      this.error.set('No se pudo determinar el usuario actual. Vuelva a iniciar sesión.');
      return;
    }

    this.avisoProximidad.set(null);
    this.guardarCita(idUsuario, false);
  }

  confirmarProximidad(): void {
    const idUsuario = this.authService.idUsuario();
    if (!idUsuario) {
      return;
    }
    this.avisoProximidad.set(null);
    this.guardarCita(idUsuario, true);
  }

  cancelarProximidad(): void {
    this.avisoProximidad.set(null);
  }

  private guardarCita(idUsuario: number, forzarGuardado: boolean): void {
    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const request: CitaRequest = {
      fecha: valores.fecha ?? '',
      hora: valores.hora ?? '',
      observaciones: valores.observaciones || null,
      idMotivoCita: valores.idMotivoCita as number,
      idPaciente: valores.idPaciente as number,
      idDoctor: valores.idDoctor as number,
      idUsuario,
      forzarGuardado
    };

    const id = this.idCita();
    const operacion = id ? this.citaService.actualizar(id, request) : this.citaService.crear(request);

    operacion.subscribe({
      next: () => this.router.navigateByUrl('/citas'),
      error: (err) => {
        this.guardando.set(false);
        const mensaje = err?.error?.mensaje ?? 'Error al guardar.';
        if (err?.status === 409 && !forzarGuardado) {
          this.avisoProximidad.set(mensaje);
          return;
        }
        this.error.set(mensaje);
      }
    });
  }
}
