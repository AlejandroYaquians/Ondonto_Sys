export interface AntecedenteMedico {
  idAntecedente: number;
  observacionDetalle: string | null;
  fechaRegistro: string;
  idPaciente: number;
  idAfeccion: number;
}

export interface AntecedenteMedicoRequest {
  observacionDetalle: string | null;
  fechaRegistro: string;
  idPaciente: number;
  idAfeccion: number;
}
