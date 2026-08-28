export interface HistorialClinico {
  idHistorialClinico: number;
  fecha: string;
  descripcion: string;
  idCita: number | null;
  idPaciente: number;
  idDoctor: number;
  idUsuarioCreacion: number | null;
}

export interface HistorialClinicoRequest {
  descripcion: string;
  idCita: number | null;
  idPaciente: number;
  idDoctor: number;
}
