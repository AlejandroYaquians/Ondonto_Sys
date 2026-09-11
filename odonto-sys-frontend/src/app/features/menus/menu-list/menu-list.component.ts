import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';
import { ModuloService } from '../../../core/services/modulo.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { MenuItem } from '../../../core/models/menu.models';
import { Modulo } from '../../../core/models/modulo.models';

interface GrupoModulo {
  modulo: Modulo;
  menus: MenuItem[];
}

@Component({
  selector: 'app-menu-list',
  imports: [RouterLink],
  templateUrl: './menu-list.component.html'
})
export class MenuListComponent {
  private readonly menuService = inject(MenuService);
  private readonly moduloService = inject(ModuloService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly menus = signal<MenuItem[]>([]);
  protected readonly modulos = signal<Modulo[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly grupos = computed<GrupoModulo[]>(() => {
    return this.modulos()
      .map((modulo) => ({
        modulo,
        menus: this.menus()
          .filter((m) => m.idModulo === modulo.idModulo)
          .sort((a, b) => a.orden - b.orden)
      }))
      .filter((grupo) => grupo.menus.length > 0);
  });

  constructor() {
    this.moduloService.listarActivos().subscribe((datos) => this.modulos.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.menuService.listar().subscribe({
      next: (datos) => {
        this.menus.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  desactivar(menu: MenuItem): void {
    if (!window.confirm(`¿Desea eliminar la vista "${menu.nombre}"?`)) {
      return;
    }
    this.menuService.desactivar(menu.idMenu).subscribe({
      next: () => {
        this.notificacionService.exito('Vista eliminada.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
