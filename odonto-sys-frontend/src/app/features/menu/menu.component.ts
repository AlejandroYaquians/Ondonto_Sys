import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CitaService } from '../../core/services/cita.service';
import { PacienteService } from '../../core/services/paciente.service';
import { DoctorService } from '../../core/services/doctor.service';
import { CatalogosService } from '../../core/services/catalogos.service';
import { Cita } from '../../core/models/cita.models';
import { Paciente } from '../../core/models/paciente.models';
import { Doctor } from '../../core/models/doctor.models';
import { CatEstadoCita } from '../../core/models/catalogo.models';

interface DiaCalendario {
  numero: number;
  fechaIso: string;
  esHoy: boolean;
  citas: Cita[];
}

function fechaIso(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly citaService = inject(CitaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly citas = signal<Cita[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly estados = signal<CatEstadoCita[]>([]);
  protected readonly cargando = signal(true);

  protected readonly anioActual = signal(new Date().getFullYear());
  protected readonly mesActual = signal(new Date().getMonth());
  protected readonly diaSeleccionado = signal(fechaIso(new Date()));

  protected readonly nombreMes = computed(() =>
    new Date(this.anioActual(), this.mesActual(), 1).toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })
  );

  protected readonly diasCalendario = computed<(DiaCalendario | null)[]>(() => {
    const anio = this.anioActual();
    const mes = this.mesActual();
    const primerDiaSemana = new Date(anio, mes, 1).getDay();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const celdas: (DiaCalendario | null)[] = [];

    for (let i = 0; i < primerDiaSemana; i++) {
      celdas.push(null);
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const iso = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      celdas.push({
        numero: dia,
        fechaIso: iso,
        esHoy: iso === fechaIso(new Date()),
        citas: this.citas().filter((c) => c.fecha === iso)
      });
    }

    return celdas;
  });

  protected readonly citasDelDiaSeleccionado = computed(() =>
    this.citas()
      .filter((c) => c.fecha === this.diaSeleccionado())
      .sort((a, b) => a.hora.localeCompare(b.hora))
  );

  ngOnInit(): void {
    this.citaService.listar().subscribe({
      next: (datos) => {
        this.citas.set(datos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos));
    this.doctorService.listar().subscribe((datos) => this.doctores.set(datos));
    this.catalogosService.estadosCita().subscribe((datos) => this.estados.set(datos));
  }

  mesAnterior(): void {
    const fecha = new Date(this.anioActual(), this.mesActual() - 1, 1);
    this.anioActual.set(fecha.getFullYear());
    this.mesActual.set(fecha.getMonth());
  }

  mesSiguiente(): void {
    const fecha = new Date(this.anioActual(), this.mesActual() + 1, 1);
    this.anioActual.set(fecha.getFullYear());
    this.mesActual.set(fecha.getMonth());
  }

  seleccionarDia(dia: DiaCalendario): void {
    this.diaSeleccionado.set(dia.fechaIso);
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
}
