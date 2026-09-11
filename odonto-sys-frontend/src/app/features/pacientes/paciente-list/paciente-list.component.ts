import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Paciente } from '../../../core/models/paciente.models';
import { CatProfesion, Municipio } from '../../../core/models/catalogo.models';

function calcularEdad(fechaNacimiento: string): number | null {
  if (!fechaNacimiento) {
    return null;
  }
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) {
    edad--;
  }
  return edad;
}

@Component({
  selector: 'app-paciente-list',
  imports: [RouterLink],
  templateUrl: './paciente-list.component.html'
})
export class PacienteListComponent {
  private readonly pacienteService = inject(PacienteService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly municipios = signal<Municipio[]>([]);
  protected readonly profesiones = signal<CatProfesion[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly termino = signal('');

  protected readonly esDoctor = computed(() => this.authService.rol() === 'DOCTOR');

  protected readonly pacientesFiltrados = computed(() => {
    const texto = this.termino().trim().toLowerCase();
    if (!texto) {
      return this.pacientes();
    }
    return this.pacientes().filter((paciente) =>
      `${paciente.nombre} ${paciente.apellido}`.toLowerCase().includes(texto)
    );
  });

  constructor() {
    this.cargar();
    this.catalogosService.municipios().subscribe((datos) => this.municipios.set(datos));
    this.catalogosService.profesiones().subscribe((datos) => this.profesiones.set(datos));
  }

  edad(fechaNacimiento: string | null): number | null {
    return fechaNacimiento ? calcularEdad(fechaNacimiento) : null;
  }

  nombreProfesion(idProfesion: number | null): string {
    if (!idProfesion) {
      return '-';
    }
    return this.profesiones().find((p) => p.idProfesion === idProfesion)?.nombre ?? '-';
  }

  private cargar(): void {
    this.cargando.set(true);
    this.pacienteService.listarActivos().subscribe({
      next: (datos) => {
        this.pacientes.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreMunicipio(idMunicipio: number | null): string {
    if (!idMunicipio) {
      return '-';
    }
    return this.municipios().find((m) => m.idMunicipio === idMunicipio)?.nombre ?? '-';
  }

  buscar(valor: string): void {
    this.termino.set(valor);
  }

  eliminar(paciente: Paciente): void {
    const confirmado = window.confirm(`¿Desea eliminar a ${paciente.nombre} ${paciente.apellido}?`);
    if (!confirmado) {
      return;
    }

    this.pacienteService.eliminar(paciente.idPaciente).subscribe({
      next: () => {
        this.notificacionService.exito('Paciente eliminado.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
