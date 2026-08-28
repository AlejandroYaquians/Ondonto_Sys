import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../../core/services/cita.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { CobroService } from '../../../core/services/cobro.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita } from '../../../core/models/cita.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';
import { CatEstadoCita, CatMotivoCita } from '../../../core/models/catalogo.models';
import { Cobro } from '../../../core/models/cobro.models';

@Component({
  selector: 'app-cita-detalle',
  imports: [RouterLink, FormsModule],
  templateUrl: './cita-detalle.component.html'
})
export class CitaDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly cobroService = inject(CobroService);
  private readonly authService = inject(AuthService);

  protected readonly cita = signal<Cita | null>(null);
  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly estados = signal<CatEstadoCita[]>([]);
  protected readonly motivos = signal<CatMotivoCita[]>([]);
  protected readonly cobros = signal<Cobro[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly cambiandoDoctor = signal(false);
  protected readonly idDoctorSeleccionado = signal<number | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly esDoctor = computed(() => this.authService.rol() === 'DOCTOR');

  protected readonly puedeEditar = computed(() => {
    const datosCita = this.cita();
    if (!datosCita || this.esDoctor()) {
      return false;
    }
    return this.nombreEstado(datosCita.idEstadoCita) !== 'Atendida';
  });

  protected readonly codigoCita = computed(() => {
    const datosCita = this.cita();
    if (!datosCita) {
      return '';
    }
    return datosCita.createdAt.replace(/[-:T.]/g, '').slice(0, 14);
  });

  protected readonly cobrosDeLaCita = computed(() => this.cobros());

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.catalogosService.estadosCita().subscribe((datos) => this.estados.set(datos));
    this.catalogosService.motivosCita().subscribe((datos) => this.motivos.set(datos));
    this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));

    this.citaService.buscarPorId(id).subscribe({
      next: (cita) => {
        this.cita.set(cita);
        this.idDoctorSeleccionado.set(cita.idDoctor);
        this.pacienteService.buscarPorId(cita.idPaciente).subscribe((datos) => this.paciente.set(datos));
        this.doctorService.buscarPorId(cita.idDoctor).subscribe((datos) => this.doctor.set(datos));
        this.cobroService.listarPorCita(cita.idCita).subscribe((datos) => this.cobros.set(datos));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  iniciarCambioDoctor(): void {
    this.cambiandoDoctor.set(true);
  }

  cancelarCambioDoctor(): void {
    const datosCita = this.cita();
    if (datosCita) {
      this.idDoctorSeleccionado.set(datosCita.idDoctor);
    }
    this.cambiandoDoctor.set(false);
  }

  confirmarCambioDoctor(): void {
    const datosCita = this.cita();
    const idDoctor = this.idDoctorSeleccionado();
    if (!datosCita || !idDoctor) {
      return;
    }
    this.citaService.cambiarDoctor(datosCita.idCita, idDoctor).subscribe({
      next: (cita) => {
        this.cita.set(cita);
        this.doctorService.buscarPorId(cita.idDoctor).subscribe((datos) => this.doctor.set(datos));
        this.cambiandoDoctor.set(false);
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  nombreEstado(idEstadoCita: number): string {
    return this.estados().find((e) => e.idEstadoCita === idEstadoCita)?.nombre ?? '—';
  }

  nombreMotivo(idMotivoCita: number): string {
    return this.motivos().find((m) => m.idMotivoCita === idMotivoCita)?.nombre ?? '—';
  }

  horaCorta(hora: string): string {
    return hora?.slice(0, 5) ?? '';
  }
}
