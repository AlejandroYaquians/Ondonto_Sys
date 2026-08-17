import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PagoService } from '../../../../core/services/pago.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { Pago } from '../../../../core/models/pago.models';
import { Paciente } from '../../../../core/models/paciente.models';

@Component({
  selector: 'app-pago-list',
  imports: [RouterLink],
  templateUrl: './pago-list.component.html'
})
export class PagoListComponent {
  private readonly pagoService = inject(PagoService);
  private readonly pacienteService = inject(PacienteService);

  protected readonly pagos = signal<Pago[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly termino = signal('');

  protected readonly pagosFiltrados = computed(() => {
    const texto = this.termino().trim().toLowerCase();
    const ordenados = [...this.pagos()].sort((a, b) => b.fecha.localeCompare(a.fecha));
    if (!texto) {
      return ordenados;
    }
    return ordenados.filter(
      (pago) =>
        this.nombrePaciente(pago.idPaciente).toLowerCase().includes(texto) ||
        pago.numeroComprobante.toLowerCase().includes(texto)
    );
  });

  constructor() {
    this.cargar();
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos));
  }

  private cargar(): void {
    this.cargando.set(true);
    this.pagoService.listar().subscribe({
      next: (datos) => {
        this.pagos.set(datos);
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

  nombrePaciente(idPaciente: number): string {
    const paciente = this.pacientes().find((p) => p.idPaciente === idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : `#${idPaciente}`;
  }

  formatoFecha(fecha: string): string {
    return fecha.slice(0, 16).replace('T', ' ');
  }

  eliminar(pago: Pago): void {
    if (!window.confirm('¿Desea eliminar este pago?')) {
      return;
    }
    this.pagoService.eliminar(pago.idPago).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
