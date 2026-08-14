import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';
import { Paciente } from '../../../core/models/paciente.models';

@Component({
  selector: 'app-paciente-list',
  imports: [RouterLink],
  templateUrl: './paciente-list.component.html'
})
export class PacienteListComponent {
  private readonly pacienteService = inject(PacienteService);

  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly termino = signal('');

  protected readonly pacientesFiltrados = computed(() => {
    const texto = this.termino().trim().toLowerCase();
    if (!texto) {
      return this.pacientes();
    }
    return this.pacientes().filter((paciente) =>
      `${paciente.nombre} ${paciente.apellido} ${paciente.email ?? ''}`.toLowerCase().includes(texto)
    );
  });

  constructor() {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.pacienteService.listar().subscribe({
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

  buscar(valor: string): void {
    this.termino.set(valor);
  }

  formatoFecha(fecha: string): string {
    return fecha ? fecha.slice(0, 16).replace('T', ' ') : '—';
  }

  eliminar(paciente: Paciente): void {
    const confirmado = window.confirm(`¿Desea inactivar a ${paciente.nombre} ${paciente.apellido}?`);
    if (!confirmado) {
      return;
    }

    this.pacienteService.eliminar(paciente.idPaciente).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
