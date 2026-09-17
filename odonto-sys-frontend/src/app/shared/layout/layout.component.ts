import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AccesoService } from '../../core/services/acceso.service';
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
  protected readonly accesoService = inject(AccesoService);
  private readonly router = inject(Router);

  protected readonly modulos = this.accesoService.modulos;
  protected readonly modulosExpandidos = signal<Set<number>>(
    new Set(this.accesoService.modulos().map((modulo) => modulo.idModulo))
  );
  protected readonly sidebarAbierta = signal(false);
  protected readonly sidebarColapsada = signal(false);
  protected readonly menuUsuarioAbierto = signal(false);

  private readonly urlActual = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      map((evento) => evento.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  moduloEstaExpandido(idModulo: number): boolean {
    return this.modulosExpandidos().has(idModulo);
  }

  moduloEstaActivo(modulo: ModuloConMenus): boolean {
    const url = this.urlActual();
    return modulo.menus.some((item) => url === item.ruta || url.startsWith(item.ruta + '/'));
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
