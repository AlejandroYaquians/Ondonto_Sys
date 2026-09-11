import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CobroService } from '../../../../core/services/cobro.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { Cobro } from '../../../../core/models/cobro.models';
import { Paciente } from '../../../../core/models/paciente.models';
import { Doctor } from '../../../../core/models/doctor.models';
import { CatMetodoPago, Servicio } from '../../../../core/models/catalogo.models';

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

@Component({
  selector: 'app-cobro-list',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cobro-list.component.html'
})
export class CobroListComponent {
  private readonly cobroService = inject(CobroService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly route = inject(ActivatedRoute);

  protected readonly cobros = signal<Cobro[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly metodosPago = signal<CatMetodoPago[]>([]);
  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly fecha = signal(this.route.snapshot.queryParamMap.get('fecha') ?? hoyIso());
  protected readonly idDoctorFiltro = signal<number | null>(null);
  protected readonly idMetodoPagoFiltro = signal<number | null>(null);

  protected readonly cobrosDelDia = computed(() => {
    const fechaSeleccionada = this.fecha();
    const idDoctor = this.idDoctorFiltro();
    const idMetodoPago = this.idMetodoPagoFiltro();
    return this.cobros()
      .filter((c) => c.fecha.slice(0, 10) === fechaSeleccionada)
      .filter((c) => idDoctor === null || c.idDoctor === idDoctor)
      .filter((c) => idMetodoPago === null || c.idMetodoPago === idMetodoPago)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  });

  constructor() {
    this.cargar();
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos));
    this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));
    this.catalogosService.metodosPago().subscribe((datos) => this.metodosPago.set(datos));
    this.catalogosService.servicios().subscribe((datos) => this.servicios.set(datos));
  }

  private cargar(): void {
    this.cargando.set(true);
    this.cobroService.listar().subscribe({
      next: (datos) => {
        this.cobros.set(datos);
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

  cambiarMetodoPago(valor: string): void {
    this.idMetodoPagoFiltro.set(valor ? Number(valor) : null);
  }

  nombrePaciente(idPaciente: number): string {
    const paciente = this.pacientes().find((p) => p.idPaciente === idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : `#${idPaciente}`;
  }

  nombreDoctor(idDoctor: number | null): string {
    if (!idDoctor) {
      return '-';
    }
    const doctor = this.doctores().find((d) => d.idDoctor === idDoctor);
    return doctor ? `Dr(a). ${doctor.nombre} ${doctor.apellido}` : `#${idDoctor}`;
  }

  nombreServicio(idServicio: number | null): string {
    if (!idServicio) {
      return '-';
    }
    const servicio = this.servicios().find((s) => s.idServicio === idServicio);
    return servicio ? servicio.nombre : `#${idServicio}`;
  }

  nombreMetodoPago(idMetodoPago: number): string {
    return this.metodosPago().find((m) => m.idMetodoPago === idMetodoPago)?.nombre ?? '-';
  }

  horaCorta(fecha: string): string {
    return fecha.slice(11, 16);
  }
}
