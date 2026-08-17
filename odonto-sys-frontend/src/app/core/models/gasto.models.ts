export interface Gasto {
  idGasto: number;
  descripcion: string;
  monto: number;
  fecha: string;
  comprobante: string | null;
  idTipoGasto: number;
  idUsuario: number;
}

export interface GastoRequest {
  descripcion: string;
  monto: number;
  fecha: string;
  comprobante: string | null;
  idTipoGasto: number;
  idUsuario: number;
}
