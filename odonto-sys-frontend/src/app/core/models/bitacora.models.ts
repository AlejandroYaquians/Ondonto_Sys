export interface Bitacora {
  idBitacora: number;
  tablaAfectada: string;
  idRegistro: number;
  accion: string;
  campoModificado: string | null;
  valorAnterior: string | null;
  valorNuevo: string | null;
  fechaHora: string;
  ipOrigen: string | null;
  idUsuario: number | null;
}
