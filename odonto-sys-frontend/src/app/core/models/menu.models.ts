export interface MenuItem {
  idMenu: number;
  nombre: string;
  ruta: string;
  orden: number;
  activo: boolean;
  idModulo: number;
}

export interface ModuloConMenus {
  idModulo: number;
  nombre: string;
  menus: MenuItem[];
}

export interface MenuRequest {
  nombre: string;
  ruta: string | null;
  orden: number | null;
  idModulo: number;
}
