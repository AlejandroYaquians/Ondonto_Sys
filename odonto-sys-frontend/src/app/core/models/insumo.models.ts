export interface Insumo {
  idInsumo: number;
  nombre: string;
  descripcion: string | null;
  unidadMedida: string | null;
  stockActual: number | null;
  stockMinimo: number | null;
  activo: boolean;
}

export interface InsumoRequest {
  nombre: string;
  descripcion: string | null;
  unidadMedida: string | null;
  stockActual: number | null;
  stockMinimo: number | null;
}

export interface InsumoMovimiento {
  idMovimiento: number;
  cantidad: number;
  fecha: string;
  motivo: string | null;
  idInsumo: number;
  idTipoMovimiento: number;
  idUsuario: number;
}

export interface InsumoMovimientoRequest {
  cantidad: number;
  motivo: string | null;
  idInsumo: number;
  idTipoMovimiento: number;
}
