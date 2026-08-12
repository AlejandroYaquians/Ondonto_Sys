export interface Cita {
  idCita: number;
  fecha: string;
  hora: string;
  horaFin: string | null;
  motivo: string | null;
  idPaciente: number;
  idDoctor: number;
  idEstadoCita: number;
  idUsuario: number;
}

export interface CitaRequest {
  fecha: string;
  hora: string;
  horaFin: string | null;
  motivo: string | null;
  idPaciente: number;
  idDoctor: number;
  idEstadoCita: number;
  idUsuario: number;
}
