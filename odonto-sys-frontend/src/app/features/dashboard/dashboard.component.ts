import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CitaService } from '../../core/services/cita.service';
import { PacienteService } from '../../core/services/paciente.service';
import { DoctorService } from '../../core/services/doctor.service';
import { CatalogosService } from '../../core/services/catalogos.service';
import { ReporteFinancieroService } from '../../core/services/reporte-financiero.service';
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

const ESTADOS_OCULTOS_EN_CALENDARIO = ['Cancelada', 'No asistió', 'Atendida'];
const ROL_ADMIN = 'ADMIN';

function fechaIso(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function primerDiaDelMesIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-01`;
}

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly citaService = inject(CitaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly reporteFinancieroService = inject(ReporteFinancieroService);

  protected readonly citas = signal<Cita[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly estados = signal<CatEstadoCita[]>([]);
  protected readonly cargando = signal(true);
  protected readonly ingresosMes = signal(0);

  protected readonly esAdmin = computed(() => this.authService.rol() === ROL_ADMIN);

  protected readonly fechaLarga = computed(() => {
    const texto = new Date().toLocaleDateString('es-GT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  });

  protected readonly anioActual = signal(new Date().getFullYear());
  protected readonly mesActual = signal(new Date().getMonth());
  protected readonly diaSeleccionado = signal(fechaIso(new Date()));

  protected readonly nombreMes = computed(() => {
    const mes = new Date(this.anioActual(), this.mesActual(), 1).toLocaleDateString('es-GT', { month: 'long' });
    return `${mes} ${this.anioActual()}`;
  });

  private readonly citasVisiblesEnCalendario = computed(() =>
    this.citas().filter((c) => !ESTADOS_OCULTOS_EN_CALENDARIO.includes(this.nombreEstado(c.idEstadoCita)))
  );

  protected readonly diasCalendario = computed<(DiaCalendario | null)[]>(() => {
    const anio = this.anioActual();
    const mes = this.mesActual();
    const primerDiaSemana = new Date(anio, mes, 1).getDay();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const celdas: (DiaCalendario | null)[] = [];
    const citasVisibles = this.citasVisiblesEnCalendario();

    for (let i = 0; i < primerDiaSemana; i++) {
      celdas.push(null);
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const iso = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      celdas.push({
        numero: dia,
        fechaIso: iso,
        esHoy: iso === fechaIso(new Date()),
        citas: citasVisibles.filter((c) => c.fecha === iso)
      });
    }

    return celdas;
  });

  protected readonly citasDelDiaSeleccionado = computed(() =>
    this.citasVisiblesEnCalendario()
      .filter((c) => c.fecha === this.diaSeleccionado())
      .sort((a, b) => a.hora.localeCompare(b.hora))
  );

  protected readonly agendaHoy = computed(() => {
    const hoy = fechaIso(new Date());
    return this.citasVisiblesEnCalendario()
      .filter((c) => c.fecha === hoy)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  });

  protected readonly citasHoyCount = computed(() => this.agendaHoy().length);
  protected readonly totalPacientes = computed(() => this.pacientes().length);
  protected readonly doctoresActivosCount = computed(() => this.doctores().filter((d) => d.activo).length);

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

    if (this.esAdmin()) {
      this.reporteFinancieroService
        .generar(primerDiaDelMesIso(), fechaIso(new Date()))
        .subscribe((datos) => this.ingresosMes.set(datos.ingresosBrutos));
    }
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

  fechaDiaMesAnio(fechaIso: string): string {
    const [anio, mes, dia] = fechaIso.split('-');
    return `${dia}-${mes}-${anio}`;
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
}
