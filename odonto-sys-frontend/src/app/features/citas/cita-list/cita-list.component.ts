import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { HistorialClinicoService } from '../../../core/services/historial-clinico.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Cita } from '../../../core/models/cita.models';
import { HistorialClinico } from '../../../core/models/historial-clinico.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';
import { CatEstadoCita, CatMotivoCita } from '../../../core/models/catalogo.models';

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

const TRANSICIONES: Record<string, string[]> = {
  Confirmada: ['Cancelada', 'No asistió'],
  Pendiente: ['Confirmada', 'Cancelada', 'No asistió']
};

@Component({
  selector: 'app-cita-list',
  imports: [RouterLink],
  templateUrl: './cita-list.component.html',
  styleUrl: './cita-list.component.scss'
})
export class CitaListComponent {
  private readonly citaService = inject(CitaService);
  private readonly historialClinicoService = inject(HistorialClinicoService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly esDoctor = computed(() => this.authService.rol() === 'DOCTOR');

  protected readonly citas = signal<Cita[]>([]);
  protected readonly historiales = signal<HistorialClinico[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly estados = signal<CatEstadoCita[]>([]);
  protected readonly motivos = signal<CatMotivoCita[]>([]);
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
    this.catalogosService.motivosCita().subscribe((datos) => this.motivos.set(datos));
    this.historialClinicoService.listar().subscribe((datos) => this.historiales.set(datos));
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

  diaAnterior(): void {
    this.fecha.set(sumarDias(this.fecha(), -1));
  }

  diaSiguiente(): void {
    this.fecha.set(sumarDias(this.fecha(), 1));
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
    return this.estados().find((e) => e.idEstadoCita === idEstadoCita)?.nombre ?? '-';
  }

  nombreMotivo(idMotivoCita: number): string {
    return this.motivos().find((m) => m.idMotivoCita === idMotivoCita)?.nombre ?? '-';
  }

  transicionesDisponibles(cita: Cita): string[] {
    return TRANSICIONES[this.nombreEstado(cita.idEstadoCita)] ?? [];
  }

  esConfirmadaOPendiente(cita: Cita): boolean {
    const estado = this.nombreEstado(cita.idEstadoCita);
    return estado === 'Confirmada' || estado === 'Pendiente';
  }

  esAtendida(cita: Cita): boolean {
    return this.nombreEstado(cita.idEstadoCita) === 'Atendida';
  }

  esEstadoFinal(cita: Cita): boolean {
    const estado = this.nombreEstado(cita.idEstadoCita);
    return estado === 'Atendida' || estado === 'Cancelada' || estado === 'No asistió';
  }

  idHistorialDe(idCita: number): number | null {
    return this.historiales().find((h) => h.idCita === idCita)?.idHistorialClinico ?? null;
  }

  cambiarEstado(cita: Cita, nuevoEstado: string): void {
    if (!nuevoEstado) {
      return;
    }
    this.citaService.cambiarEstado(cita.idCita, nuevoEstado).subscribe({
      next: () => {
        this.notificacionService.exito('Estado de la cita actualizado.');
        this.cargar();
      },
      error: () => this.error.set('Error al cambiar el estado.')
    });
  }

  eliminar(cita: Cita): void {
    const confirmado = window.confirm(
      `¿Desea eliminar la cita de ${this.nombrePaciente(cita.idPaciente)} del ${cita.fecha} a las ${this.horaCorta(cita.hora)}?`
    );
    if (!confirmado) {
      return;
    }

    this.citaService.eliminar(cita.idCita).subscribe({
      next: () => {
        this.notificacionService.exito('Cita eliminada.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar la cita.')
    });
  }
}
