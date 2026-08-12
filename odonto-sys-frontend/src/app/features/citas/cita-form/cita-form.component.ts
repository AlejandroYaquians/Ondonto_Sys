import { Component, OnInit, inject, signal } from '@angular/core';
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
import { CatEstadoCita } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-cita-form',
  imports: [ReactiveFormsModule, RouterLink],
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

  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly estados = signal<CatEstadoCita[]>([]);

  protected readonly formulario = this.fb.group({
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    horaFin: [''],
    motivo: [''],
    idPaciente: [null as number | null, Validators.required],
    idDoctor: [null as number | null, Validators.required],
    idEstadoCita: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos.filter((p) => p.activo)));
    this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));
    this.catalogosService.estadosCita().subscribe((datos) => this.estados.set(datos));

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
          horaFin: cita.horaFin?.slice(0, 5) ?? '',
          motivo: cita.motivo ?? '',
          idPaciente: cita.idPaciente,
          idDoctor: cita.idDoctor,
          idEstadoCita: cita.idEstadoCita
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la cita.');
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const idUsuario = this.authService.idUsuario();
    if (!idUsuario) {
      this.error.set('No se pudo determinar el usuario actual. Vuelva a iniciar sesión.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const request: CitaRequest = {
      fecha: valores.fecha ?? '',
      hora: valores.hora ?? '',
      horaFin: valores.horaFin || null,
      motivo: valores.motivo || null,
      idPaciente: valores.idPaciente as number,
      idDoctor: valores.idDoctor as number,
      idEstadoCita: valores.idEstadoCita as number,
      idUsuario
    };

    const id = this.idCita();
    const operacion = id ? this.citaService.actualizar(id, request) : this.citaService.crear(request);

    operacion.subscribe({
      next: () => this.router.navigateByUrl('/citas'),
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje ?? 'No se pudo guardar la cita. Verifique los datos y el horario.');
      }
    });
  }
}
