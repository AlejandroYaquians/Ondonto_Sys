export interface Cita {
  idCita: number;
  fecha: string;
  hora: string;
  observaciones: string | null;
  idMotivoCita: number;
  idPaciente: number;
  idDoctor: number;
  idEstadoCita: number;
  idUsuario: number;
  createdAt: string;
}

export interface CitaRequest {
  fecha: string;
  hora: string;
  observaciones: string | null;
  idMotivoCita: number;
  idPaciente: number;
  idDoctor: number;
  idUsuario: number;
  forzarGuardado: boolean;
}
