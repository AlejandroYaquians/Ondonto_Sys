import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistorialClinicoService } from '../../../core/services/historial-clinico.service';
import { RecetaService } from '../../../core/services/receta.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { HistorialClinico } from '../../../core/models/historial-clinico.models';
import { Receta } from '../../../core/models/receta.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-historial-clinico-detalle',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './historial-clinico-detalle.component.html'
})
export class HistorialClinicoDetalleComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly historialClinicoService = inject(HistorialClinicoService);
  private readonly recetaService = inject(RecetaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly historial = signal<HistorialClinico | null>(null);
  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly recetas = signal<Receta[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly editandoDescripcion = signal(false);
  protected readonly idRecetaEditando = signal<number | null>(null);
  protected readonly mostrarFormularioReceta = signal(false);
  protected readonly guardando = signal(false);

  protected readonly esDoctor = computed(() => this.authService.rol() === 'DOCTOR');
  protected readonly puedeEditar = computed(
    () => !this.esDoctor() || this.doctor()?.idUsuario === this.authService.idUsuario()
  );

  protected readonly formularioDescripcion = this.fb.group({
    descripcion: ['']
  });

  protected readonly formularioReceta = this.fb.group({
    medicamento: ['', Validators.required],
    dosis: [''],
    frecuencia: [''],
    duracion: [''],
    indicaciones: ['']
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar(id);
  }

  private cargar(id: number): void {
    this.cargando.set(true);
    this.historialClinicoService.buscarPorId(id).subscribe({
      next: (historial) => {
        this.historial.set(historial);
        this.pacienteService.buscarPorId(historial.idPaciente).subscribe((datos) => this.paciente.set(datos));
        this.doctorService.buscarPorId(historial.idDoctor).subscribe((datos) => this.doctor.set(datos));
        this.recetaService.listarPorHistorialClinico(historial.idHistorialClinico).subscribe((datos) => this.recetas.set(datos));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  formatoFecha(fecha: string): string {
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }

  fechaDiaMesAnio(fechaIso: string): string {
    const [anio, mes, dia] = fechaIso.split('-');
    return `${dia}-${mes}-${anio}`;
  }

  iniciarEdicionDescripcion(): void {
    const historial = this.historial();
    if (!historial) {
      return;
    }
    this.formularioDescripcion.setValue({ descripcion: historial.descripcion });
    this.editandoDescripcion.set(true);
  }

  cancelarEdicionDescripcion(): void {
    this.editandoDescripcion.set(false);
  }

  guardarDescripcion(): void {
    const historial = this.historial();
    if (!historial || this.formularioDescripcion.invalid) {
      this.formularioDescripcion.markAllAsTouched();
      return;
    }

    this.historialClinicoService
      .actualizar(historial.idHistorialClinico, {
        descripcion: this.formularioDescripcion.getRawValue().descripcion ?? '',
        idCita: historial.idCita,
        idPaciente: historial.idPaciente,
        idDoctor: historial.idDoctor
      })
      .subscribe({
        next: (actualizado) => {
          this.historial.set(actualizado);
          this.editandoDescripcion.set(false);
          this.notificacionService.exito('Notas actualizadas.');
        },
        error: () => this.error.set('Error al guardar.')
      });
  }

  toggleFormularioReceta(): void {
    this.mostrarFormularioReceta.update((actual) => !actual);
  }

  editarReceta(receta: Receta): void {
    this.idRecetaEditando.set(receta.idReceta);
    this.mostrarFormularioReceta.set(true);
    this.formularioReceta.setValue({
      medicamento: receta.medicamento,
      dosis: receta.dosis ?? '',
      frecuencia: receta.frecuencia ?? '',
      duracion: receta.duracion ?? '',
      indicaciones: receta.indicaciones ?? ''
    });
  }

  cancelarReceta(): void {
    this.idRecetaEditando.set(null);
    this.mostrarFormularioReceta.set(false);
    this.formularioReceta.reset({ medicamento: '', dosis: '', frecuencia: '', duracion: '', indicaciones: '' });
  }

  guardarReceta(): void {
    const historial = this.historial();
    if (!historial || this.formularioReceta.invalid) {
      this.formularioReceta.markAllAsTouched();
      return;
    }

    const valores = this.formularioReceta.getRawValue();
    const request = {
      medicamento: valores.medicamento ?? '',
      dosis: valores.dosis || null,
      frecuencia: valores.frecuencia || null,
      duracion: valores.duracion || null,
      indicaciones: valores.indicaciones || null,
      fecha: hoyIso(),
      idHistorialClinico: historial.idHistorialClinico
    };

    const id = this.idRecetaEditando();
    const operacion = id ? this.recetaService.actualizar(id, request) : this.recetaService.crear(request);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(id ? 'Receta actualizada.' : 'Receta agregada.');
        this.cancelarReceta();
        this.recetaService.listarPorHistorialClinico(historial.idHistorialClinico).subscribe((datos) => this.recetas.set(datos));
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminarReceta(receta: Receta): void {
    if (!window.confirm('¿Desea eliminar esta receta?')) {
      return;
    }
    const historial = this.historial();
    this.recetaService.eliminar(receta.idReceta).subscribe({
      next: () => {
        this.notificacionService.exito('Receta eliminada.');
        if (historial) {
          this.recetaService.listarPorHistorialClinico(historial.idHistorialClinico).subscribe((datos) => this.recetas.set(datos));
        }
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
