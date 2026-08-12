export interface MenuItem {
  idMenu: number;
  nombre: string;
  ruta: string;
  icono: string | null;
  orden: number;
  activo: boolean;
  idModulo: number;
}

export interface ModuloConMenus {
  idModulo: number;
  nombre: string;
  menus: MenuItem[];
}
