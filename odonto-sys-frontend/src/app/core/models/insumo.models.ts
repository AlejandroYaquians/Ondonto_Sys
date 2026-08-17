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
}

export interface InsumoMovimiento {
  idMovimiento: number;
  cantidad: number;
  fecha: string;
  motivo: string | null;
  idInsumo: number;
  idTipoMovimiento: number;
  idGasto: number | null;
  idUsuario: number;
}

export interface InsumoMovimientoRequest {
  cantidad: number;
  motivo: string | null;
  idInsumo: number;
  idTipoMovimiento: number;
  idGasto: number | null;
  idUsuario: number;
}

export interface InsumoServicio {
  idInsumoServicio: number;
  cantidadEstimada: number | null;
  idInsumo: number;
  idServicio: number;
}

export interface InsumoServicioRequest {
  cantidadEstimada: number | null;
  idInsumo: number;
  idServicio: number;
}
