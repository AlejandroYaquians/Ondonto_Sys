import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { PermisoService } from '../../core/services/permiso.service';
import { RolService } from '../../core/services/rol.service';
import { NavegacionService } from '../../core/services/navegacion.service';
import { Permiso, PermisoRequest } from '../../core/models/permiso.models';
import { Rol } from '../../core/models/rol.models';
import { ModuloConMenus } from '../../core/models/menu.models';

interface CeldaPermiso {
  idPermiso: number | null;
  puedeVer: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
}

const VISTAS_SOLO_LECTURA = new Set(['/bitacora', '/dashboard', '/financiero/dashboard']);
const VISTAS_SIN_EDITAR_NI_ELIMINAR = new Set(['/financiero/pago-comisiones']);

@Component({
  selector: 'app-permisos',
  imports: [],
  templateUrl: './permisos.component.html'
})
export class PermisosComponent implements OnInit {
  private readonly permisoService = inject(PermisoService);
  private readonly rolService = inject(RolService);
  private readonly navegacionService = inject(NavegacionService);

  protected readonly roles = signal<Rol[]>([]);
  protected readonly modulos = signal<ModuloConMenus[]>([]);
  protected readonly idRolSeleccionado = signal<number | null>(null);
  protected readonly celdas = signal<Record<number, CeldaPermiso>>({});
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);

  ngOnInit(): void {
    this.rolService.listar().subscribe((datos) => this.roles.set(datos));
    this.navegacionService.obtenerNavegacion().subscribe((datos) => this.modulos.set(datos));
  }

  seleccionarRol(valor: string): void {
    const idRol = valor ? Number(valor) : null;
    this.idRolSeleccionado.set(idRol);
    this.mensajeExito.set(null);
    if (idRol === null) {
      this.celdas.set({});
      return;
    }
    this.cargarPermisos(idRol);
  }

  private cargarPermisos(idRol: number): void {
    this.cargando.set(true);
    this.error.set(null);
    this.permisoService.listarPorRol(idRol).subscribe({
      next: (permisos) => {
        const celdas: Record<number, CeldaPermiso> = {};
        for (const modulo of this.modulos()) {
          for (const menu of modulo.menus) {
            const existente = permisos.find((p) => p.idMenu === menu.idMenu);
            celdas[menu.idMenu] = existente
              ? {
                  idPermiso: existente.idPermiso,
                  puedeVer: existente.puedeVer,
                  puedeCrear: existente.puedeCrear,
                  puedeEditar: existente.puedeEditar,
                  puedeEliminar: existente.puedeEliminar
                }
              : { idPermiso: null, puedeVer: false, puedeCrear: false, puedeEditar: false, puedeEliminar: false };
          }
        }
        this.celdas.set(celdas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los permisos.');
        this.cargando.set(false);
      }
    });
  }

  muestraCrear(ruta: string): boolean {
    return !VISTAS_SOLO_LECTURA.has(ruta);
  }

  muestraEditar(ruta: string): boolean {
    return !VISTAS_SOLO_LECTURA.has(ruta) && !VISTAS_SIN_EDITAR_NI_ELIMINAR.has(ruta);
  }

  muestraEliminar(ruta: string): boolean {
    return this.muestraEditar(ruta);
  }

  marcar(idMenu: number, campo: keyof Omit<CeldaPermiso, 'idPermiso'>, valor: boolean): void {
    const celdas = { ...this.celdas() };
    celdas[idMenu] = { ...celdas[idMenu], [campo]: valor };
    this.celdas.set(celdas);
  }

  guardar(): void {
    const idRol = this.idRolSeleccionado();
    if (idRol === null) {
      return;
    }

    this.guardando.set(true);
    this.error.set(null);
    this.mensajeExito.set(null);

    const celdas = this.celdas();
    const operaciones: Observable<Permiso>[] = [];

    for (const idMenuTexto of Object.keys(celdas)) {
      const idMenu = Number(idMenuTexto);
      const celda = celdas[idMenu];
      const request: PermisoRequest = {
        idRol,
        idMenu,
        puedeVer: celda.puedeVer,
        puedeCrear: celda.puedeCrear,
        puedeEditar: celda.puedeEditar,
        puedeEliminar: celda.puedeEliminar
      };

      if (celda.idPermiso) {
        operaciones.push(this.permisoService.actualizar(celda.idPermiso, request));
      } else if (celda.puedeVer || celda.puedeCrear || celda.puedeEditar || celda.puedeEliminar) {
        operaciones.push(this.permisoService.crear(request));
      }
    }

    if (operaciones.length === 0) {
      this.guardando.set(false);
      this.mensajeExito.set('No hay cambios que guardar.');
      return;
    }

    forkJoin(operaciones).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mensajeExito.set('Permisos guardados correctamente.');
        this.cargarPermisos(idRol);
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar los permisos.');
      }
    });
  }
}
