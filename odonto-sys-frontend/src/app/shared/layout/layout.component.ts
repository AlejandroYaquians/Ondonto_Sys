import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavegacionService } from '../../core/services/navegacion.service';
import { ModuloConMenus } from '../../core/models/menu.models';
import { ToastContainerComponent } from '../toast-container/toast-container.component';

const ICONOS_POR_MODULO: Record<string, string> = {
  Dashboard: 'bi-speedometer2',
  Agenda: 'bi-calendar-week',
  Clínico: 'bi-heart-pulse',
  Finanzas: 'bi-cash-stack',
  Inventario: 'bi-boxes',
  Catálogos: 'bi-tags',
  Auditoría: 'bi-journal-text',
  Administración: 'bi-gear-wide-connected'
};

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  protected readonly authService = inject(AuthService);
  private readonly navegacionService = inject(NavegacionService);

  protected readonly modulos = signal<ModuloConMenus[]>([]);
  protected readonly modulosExpandidos = signal<Set<number>>(new Set());
  protected readonly sidebarAbierta = signal(false);
  protected readonly sidebarColapsada = signal(false);
  protected readonly menuUsuarioAbierto = signal(false);

  constructor() {
    this.navegacionService.obtenerNavegacion().subscribe((datos) => {
      this.modulos.set(datos);
      this.modulosExpandidos.set(new Set(datos.map((modulo) => modulo.idModulo)));
    });
  }

  moduloEstaExpandido(idModulo: number): boolean {
    return this.modulosExpandidos().has(idModulo);
  }

  toggleModulo(idModulo: number): void {
    this.modulosExpandidos.update((actuales) => {
      const nuevos = new Set(actuales);
      if (nuevos.has(idModulo)) {
        nuevos.delete(idModulo);
      } else {
        nuevos.add(idModulo);
      }
      return nuevos;
    });
  }

  toggleSidebar(): void {
    this.sidebarAbierta.update((abierta) => !abierta);
  }

  cerrarSidebar(): void {
    this.sidebarAbierta.set(false);
  }

  toggleSidebarColapsar(): void {
    this.sidebarColapsada.update((colapsada) => !colapsada);
  }

  toggleMenuUsuario(): void {
    this.menuUsuarioAbierto.update((abierto) => !abierto);
  }

  cerrarMenuUsuario(): void {
    this.menuUsuarioAbierto.set(false);
  }

  iconoDeModulo(nombre: string): string {
    return ICONOS_POR_MODULO[nombre] || 'bi-folder2';
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
