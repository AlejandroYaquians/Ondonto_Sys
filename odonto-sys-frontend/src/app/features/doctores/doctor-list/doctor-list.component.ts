import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Doctor } from '../../../core/models/doctor.models';
import { CatEspecialidad } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-doctor-list',
  imports: [RouterLink],
  templateUrl: './doctor-list.component.html'
})
export class DoctorListComponent {
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly especialidades = signal<CatEspecialidad[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly termino = signal('');

  protected readonly esAdmin = computed(() => this.authService.rol() === 'ADMIN');

  protected readonly doctoresFiltrados = computed(() => {
    const texto = this.termino().trim().toLowerCase();
    if (!texto) {
      return this.doctores();
    }
    return this.doctores().filter((doctor) =>
      `${doctor.nombre} ${doctor.apellido}`.toLowerCase().includes(texto)
    );
  });

  constructor() {
    this.cargar();
    this.catalogosService.especialidades().subscribe((datos) => this.especialidades.set(datos));
  }

  private cargar(): void {
    this.cargando.set(true);
    this.doctorService.listar().subscribe({
      next: (datos) => {
        this.doctores.set(datos);
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

  nombresEspecialidades(idsEspecialidad: number[]): string {
    if (!idsEspecialidad.length) {
      return '-';
    }
    return idsEspecialidad
      .map((id) => this.especialidades().find((e) => e.idEspecialidad === id)?.nombre)
      .filter((nombre): nombre is string => !!nombre)
      .join(', ');
  }

  eliminar(doctor: Doctor): void {
    const confirmado = window.confirm(`¿Desea eliminar al Dr(a). ${doctor.nombre} ${doctor.apellido}?`);
    if (!confirmado) {
      return;
    }

    this.doctorService.eliminar(doctor.idDoctor).subscribe({
      next: () => {
        this.notificacionService.exito('Doctor eliminado.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
