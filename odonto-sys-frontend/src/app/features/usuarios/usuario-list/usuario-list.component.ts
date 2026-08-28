import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { RolService } from '../../../core/services/rol.service';
import { Usuario } from '../../../core/models/usuario.models';
import { Rol } from '../../../core/models/rol.models';

@Component({
  selector: 'app-usuario-list',
  imports: [RouterLink],
  templateUrl: './usuario-list.component.html'
})
export class UsuarioListComponent {
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly roles = signal<Rol[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.cargar();
    this.rolService.listar().subscribe((datos) => this.roles.set(datos));
  }

  private cargar(): void {
    this.cargando.set(true);
    this.usuarioService.listar().subscribe({
      next: (datos) => {
        this.usuarios.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreRol(idRol: number): string {
    return this.roles().find((r) => r.idRol === idRol)?.nombre ?? `#${idRol}`;
  }

  cambiarEstado(usuario: Usuario): void {
    const nuevoEstado = !usuario.estado;
    const mensaje = nuevoEstado
      ? `¿Desea activar a ${usuario.nombre}?`
      : `¿Desea desactivar a ${usuario.nombre}?`;
    if (!window.confirm(mensaje)) {
      return;
    }

    this.usuarioService.cambiarEstado(usuario.idUsuario, nuevoEstado).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al cambiar el estado.')
    });
  }
}
