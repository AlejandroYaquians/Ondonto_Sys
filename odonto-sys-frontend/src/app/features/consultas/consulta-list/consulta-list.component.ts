import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsultaService } from '../../../core/services/consulta.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Consulta } from '../../../core/models/consulta.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';

@Component({
  selector: 'app-consulta-list',
  imports: [RouterLink],
  templateUrl: './consulta-list.component.html'
})
export class ConsultaListComponent {
  private readonly consultaService = inject(ConsultaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);

  protected readonly consultas = signal<Consulta[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly termino = signal('');

  protected readonly consultasFiltradas = computed(() => {
    const texto = this.termino().trim().toLowerCase();
    const ordenadas = [...this.consultas()].sort((a, b) => b.fecha.localeCompare(a.fecha));
    if (!texto) {
      return ordenadas;
    }
    return ordenadas.filter((consulta) => this.nombrePaciente(consulta.idPaciente).toLowerCase().includes(texto));
  });

  constructor() {
    this.cargar();
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos));
    this.doctorService.listar().subscribe((datos) => this.doctores.set(datos));
  }

  private cargar(): void {
    this.cargando.set(true);
    this.consultaService.listar().subscribe({
      next: (datos) => {
        this.consultas.set(datos);
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

  nombreDoctor(idDoctor: number): string {
    const doctor = this.doctores().find((d) => d.idDoctor === idDoctor);
    return doctor ? `${doctor.nombre} ${doctor.apellido}` : `#${idDoctor}`;
  }

  formatoFecha(fecha: string): string {
    return fecha.slice(0, 16).replace('T', ' ');
  }

  eliminar(consulta: Consulta): void {
    const confirmado = window.confirm('¿Desea eliminar esta consulta? Se eliminará también su historial clínico asociado.');
    if (!confirmado) {
      return;
    }
    this.consultaService.eliminar(consulta.idConsulta).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
