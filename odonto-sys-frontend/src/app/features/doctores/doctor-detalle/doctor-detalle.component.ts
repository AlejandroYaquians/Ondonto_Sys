import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Doctor } from '../../../core/models/doctor.models';
import { CatEspecialidad } from '../../../core/models/catalogo.models';
import { Usuario } from '../../../core/models/usuario.models';

@Component({
  selector: 'app-doctor-detalle',
  imports: [RouterLink],
  templateUrl: './doctor-detalle.component.html'
})
export class DoctorDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly especialidades = signal<CatEspecialidad[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.catalogosService.especialidades().subscribe((datos) => this.especialidades.set(datos));
    this.usuarioService.listar().subscribe((datos) => this.usuarios.set(datos));

    this.doctorService.buscarPorId(id).subscribe({
      next: (doctor) => {
        this.doctor.set(doctor);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombresEspecialidades(idsEspecialidad: number[]): string {
    if (!idsEspecialidad.length) {
      return '—';
    }
    return idsEspecialidad
      .map((id) => this.especialidades().find((e) => e.idEspecialidad === id)?.nombre)
      .filter((nombre): nombre is string => !!nombre)
      .join(', ');
  }

  nombreUsuario(idUsuario: number | null): string {
    if (!idUsuario) {
      return 'Sin vincular';
    }
    const usuario = this.usuarios().find((u) => u.idUsuario === idUsuario);
    return usuario ? `${usuario.nombre} (${usuario.username})` : '—';
  }
}
