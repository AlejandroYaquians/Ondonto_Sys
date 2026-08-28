import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitaService } from '../../../../core/services/cita.service';
import { HistorialClinicoService } from '../../../../core/services/historial-clinico.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { Cita } from '../../../../core/models/cita.models';
import { HistorialClinico } from '../../../../core/models/historial-clinico.models';
import { Doctor } from '../../../../core/models/doctor.models';
import { CatEstadoCita } from '../../../../core/models/catalogo.models';

@Component({
  selector: 'app-citas-seccion',
  imports: [RouterLink],
  templateUrl: './citas-seccion.component.html'
})
export class CitasSeccionComponent implements OnInit {
  @Input({ required: true }) idPaciente!: number;

  private readonly citaService = inject(CitaService);
  private readonly historialClinicoService = inject(HistorialClinicoService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly citas = signal<Cita[]>([]);
  protected readonly historiales = signal<HistorialClinico[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly estados = signal<CatEstadoCita[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.doctorService.listar().subscribe((datos) => this.doctores.set(datos));
    this.catalogosService.estadosCita().subscribe((datos) => this.estados.set(datos));
    this.historialClinicoService.listarPorPaciente(this.idPaciente).subscribe((datos) => this.historiales.set(datos));

    this.cargando.set(true);
    this.citaService.listarPorPaciente(this.idPaciente).subscribe({
      next: (datos) => {
        this.citas.set(datos.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.hora.localeCompare(a.hora)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreDoctor(idDoctor: number): string {
    const doctor = this.doctores().find((d) => d.idDoctor === idDoctor);
    return doctor ? `${doctor.nombre} ${doctor.apellido}` : `#${idDoctor}`;
  }

  nombreEstado(idEstadoCita: number): string {
    return this.estados().find((e) => e.idEstadoCita === idEstadoCita)?.nombre ?? '—';
  }

  horaCorta(hora: string): string {
    return hora?.slice(0, 5) ?? '';
  }

  idHistorialDe(idCita: number): number | null {
    return this.historiales().find((h) => h.idCita === idCita)?.idHistorialClinico ?? null;
  }
}
