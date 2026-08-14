export interface HistorialMedico {
  idHistorial: number;
  observacionDetalle: string | null;
  fechaRegistro: string;
  idPaciente: number;
  idAfeccion: number;
}

export interface HistorialMedicoRequest {
  observacionDetalle: string | null;
  fechaRegistro: string;
  idPaciente: number;
  idAfeccion: number;
}
