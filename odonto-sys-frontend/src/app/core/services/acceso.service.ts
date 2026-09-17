import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NavegacionService } from './navegacion.service';
import { ModuloConMenus, MenuNavegacionItem } from '../models/menu.models';

@Injectable({ providedIn: 'root' })
export class AccesoService {
  private readonly navegacionService = inject(NavegacionService);

  readonly modulos = signal<ModuloConMenus[]>([]);
  private cargado = false;

  cargar(): Observable<ModuloConMenus[]> {
    return this.navegacionService.obtenerNavegacion().pipe(
      tap((datos) => {
        this.modulos.set(datos);
        this.cargado = true;
      })
    );
  }

  estaCargado(): boolean {
    return this.cargado;
  }

  limpiar(): void {
    this.modulos.set([]);
    this.cargado = false;
  }

  puedeVer(ruta: string): boolean {
    return this.buscarMenu(ruta) !== null;
  }

  puedeCrear(ruta: string): boolean {
    return this.buscarMenu(ruta)?.puedeCrear ?? false;
  }

  puedeEditar(ruta: string): boolean {
    return this.buscarMenu(ruta)?.puedeEditar ?? false;
  }

  puedeEliminar(ruta: string): boolean {
    return this.buscarMenu(ruta)?.puedeEliminar ?? false;
  }

  private buscarMenu(ruta: string): MenuNavegacionItem | null {
    const menus = this.modulos().flatMap((modulo) => modulo.menus);
    return menus.find((item) => ruta === item.ruta || ruta.startsWith(item.ruta + '/')) ?? null;
  }
}
