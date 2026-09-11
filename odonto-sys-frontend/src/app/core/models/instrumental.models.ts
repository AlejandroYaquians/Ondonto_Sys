export interface Instrumental {
  idInstrumental: number;
  nombre: string;
  descripcion: string | null;
  stockActual: number | null;
  stockMinimo: number | null;
  activo: boolean;
}

export interface InstrumentalRequest {
  nombre: string;
  descripcion: string | null;
  stockActual: number | null;
  stockMinimo: number | null;
}

export interface InstrumentalMovimiento {
  idInstrumentalMovimiento: number;
  cantidad: number;
  fecha: string;
  motivo: string | null;
  idInstrumental: number;
  idTipoMovimiento: number;
  idUsuario: number;
}

export interface InstrumentalMovimientoRequest {
  cantidad: number;
  motivo: string | null;
  idInstrumental: number;
  idTipoMovimiento: number;
}
