import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConsultaService } from '../../../core/services/consulta.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { CitaService } from '../../../core/services/cita.service';
import { ConsultaRequest } from '../../../core/models/consulta.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';
import { Cita } from '../../../core/models/cita.models';

function ahoraLocal(): string {
  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
  return ahora.toISOString().slice(0, 16);
}

@Component({
  selector: 'app-consulta-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './consulta-form.component.html'
})
export class ConsultaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly consultaService = inject(ConsultaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly citaService = inject(CitaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly idConsulta = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly citas = signal<Cita[]>([]);

  protected readonly formulario = this.fb.group({
    fecha: [ahoraLocal(), Validators.required],
    motivoConsulta: [''],
    idPaciente: [null as number | null, Validators.required],
    idDoctor: [null as number | null, Validators.required],
    idCita: [null as number | null]
  });

  protected readonly idPacienteSeleccionado = toSignal(this.formulario.controls.idPaciente.valueChanges, {
    initialValue: this.formulario.controls.idPaciente.value
  });

  protected readonly citasDelPaciente = computed(() => {
    const idPaciente = this.idPacienteSeleccionado();
    if (!idPaciente) {
      return [];
    }
    return this.citas().filter((cita) => cita.idPaciente === idPaciente);
  });

  ngOnInit(): void {
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos.filter((p) => p.activo)));
    this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));
    this.citaService.listar().subscribe((datos) => this.citas.set(datos));

    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idConsulta.set(id);
      this.cargarConsulta(id);
      return;
    }

    const queryParams = this.route.snapshot.queryParamMap;
    const idCita = queryParams.get('idCita');
    const idPaciente = queryParams.get('idPaciente');
    const idDoctor = queryParams.get('idDoctor');
    if (idPaciente && idDoctor) {
      this.formulario.patchValue({
        idPaciente: Number(idPaciente),
        idDoctor: Number(idDoctor),
        idCita: idCita ? Number(idCita) : null
      });
    }
  }

  private cargarConsulta(id: number): void {
    this.cargando.set(true);
    this.consultaService.buscarPorId(id).subscribe({
      next: (consulta) => {
        this.formulario.patchValue({
          fecha: consulta.fecha.slice(0, 16),
          motivoConsulta: consulta.motivoConsulta ?? '',
          idPaciente: consulta.idPaciente,
          idDoctor: consulta.idDoctor,
          idCita: consulta.idCita
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
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const request: ConsultaRequest = {
      fecha: valores.fecha ?? '',
      motivoConsulta: valores.motivoConsulta || null,
      idPaciente: valores.idPaciente as number,
      idDoctor: valores.idDoctor as number,
      idCita: valores.idCita
    };

    const id = this.idConsulta();
    const operacion = id ? this.consultaService.actualizar(id, request) : this.consultaService.crear(request);

    operacion.subscribe({
      next: (consulta) => this.router.navigateByUrl(`/consultas/${consulta.idConsulta}`),
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar.');
      }
    });
  }
}
