export interface MenuItem {
  idMenu: number;
  nombre: string;
  ruta: string;
  orden: number;
  activo: boolean;
  idModulo: number;
}

export interface MenuNavegacionItem {
  idMenu: number;
  nombre: string;
  ruta: string;
  orden: number;
  idModulo: number;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
}

export interface ModuloConMenus {
  idModulo: number;
  nombre: string;
  menus: MenuNavegacionItem[];
}

export interface MenuRequest {
  nombre: string;
  ruta: string | null;
  orden: number | null;
  idModulo: number;
}
