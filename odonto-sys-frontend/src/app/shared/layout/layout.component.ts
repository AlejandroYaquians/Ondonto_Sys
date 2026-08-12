import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavegacionService } from '../../core/services/navegacion.service';
import { ModuloConMenus } from '../../core/models/menu.models';

const ICONOS_POR_RUTA: Record<string, string> = {
  '/pacientes': 'bi-people',
  '/doctores': 'bi-person-badge',
  '/citas': 'bi-calendar-event',
  '/consultas': 'bi-clipboard2-pulse',
  '/contactos-paciente': 'bi-person-lines-fill',
  '/historial-medico': 'bi-file-earmark-medical',
  '/consulta-diagnosticos': 'bi-clipboard2-check',
  '/consulta-tratamientos': 'bi-bandaid',
  '/recetas': 'bi-capsule',
  '/consulta-notas': 'bi-sticky',
  '/consulta-insumos': 'bi-box-seam',
  '/insumos': 'bi-box2',
  '/insumo-movimientos': 'bi-arrow-left-right',
  '/insumo-servicios': 'bi-link-45deg',
  '/gastos': 'bi-receipt',
  '/pagos': 'bi-credit-card',
  '/pago-detalles': 'bi-receipt-cutoff',
  '/comisiones': 'bi-percent',
  '/bitacora': 'bi-clock-history',
  '/departamentos': 'bi-map',
  '/municipios': 'bi-geo-alt',
  '/servicios': 'bi-gear',
  '/catalogos/afecciones': 'bi-thermometer-half',
  '/catalogos/diagnosticos': 'bi-clipboard2-check',
  '/catalogos/especialidades': 'bi-mortarboard',
  '/catalogos/estados-cita': 'bi-calendar-check',
  '/catalogos/tipos-gasto': 'bi-receipt',
  '/catalogos/generos': 'bi-gender-ambiguous',
  '/catalogos/metodos-pago': 'bi-credit-card-2-front',
  '/catalogos/tipos-movimiento': 'bi-arrow-left-right',
  '/catalogos/parentescos': 'bi-people',
  '/catalogos/profesiones': 'bi-briefcase',
  '/catalogos/tratamientos': 'bi-bandaid'
};

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
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

  iconoDe(ruta: string, icono: string | null): string {
    return icono || ICONOS_POR_RUTA[ruta] || 'bi-chevron-right';
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
