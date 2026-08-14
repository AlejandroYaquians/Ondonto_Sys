import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita } from '../../../core/models/cita.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';
import { CatEstadoCita } from '../../../core/models/catalogo.models';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-cita-list',
  imports: [RouterLink],
  templateUrl: './cita-list.component.html'
})
export class CitaListComponent {
  private readonly citaService = inject(CitaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly authService = inject(AuthService);

  protected readonly esDoctor = computed(() => this.authService.rol() === 'DOCTOR');

  protected readonly citas = signal<Cita[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly estados = signal<CatEstadoCita[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly fecha = signal(hoyIso());
  protected readonly idDoctorFiltro = signal<number | null>(null);

  protected readonly citasDelDia = computed(() => {
    const fechaSeleccionada = this.fecha();
    const idDoctor = this.idDoctorFiltro();
    return this.citas()
      .filter((cita) => cita.fecha === fechaSeleccionada)
      .filter((cita) => idDoctor === null || cita.idDoctor === idDoctor)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  });

  constructor() {
    this.cargar();
    this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos));
    this.catalogosService.estadosCita().subscribe((datos) => this.estados.set(datos));
  }

  private cargar(): void {
    this.cargando.set(true);
    this.citaService.listar().subscribe({
      next: (datos) => {
        this.citas.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  cambiarFecha(valor: string): void {
    this.fecha.set(valor);
  }

  cambiarDoctor(valor: string): void {
    this.idDoctorFiltro.set(valor ? Number(valor) : null);
  }

  horaCorta(hora: string): string {
    return hora?.slice(0, 5) ?? '';
  }

  nombrePaciente(idPaciente: number): string {
    const paciente = this.pacientes().find((p) => p.idPaciente === idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : `#${idPaciente}`;
  }

  nombreDoctor(idDoctor: number): string {
    const doctor = this.doctores().find((d) => d.idDoctor === idDoctor);
    return doctor ? `${doctor.nombre} ${doctor.apellido}` : `#${idDoctor}`;
  }

  nombreEstado(idEstadoCita: number): string {
    return this.estados().find((e) => e.idEstadoCita === idEstadoCita)?.nombre ?? '—';
  }

  eliminar(cita: Cita): void {
    const confirmado = window.confirm('¿Desea cancelar esta cita?');
    if (!confirmado) {
      return;
    }
    this.citaService.eliminar(cita.idCita).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
