export interface Consulta {
  idConsulta: number;
  fecha: string;
  motivoConsulta: string | null;
  idPaciente: number;
  idDoctor: number;
  idCita: number | null;
}

export interface ConsultaRequest {
  fecha: string;
  motivoConsulta: string | null;
  idPaciente: number;
  idDoctor: number;
  idCita: number | null;
}

export interface ConsultaDiagnostico {
  idConsultaDiagnostico: number;
  descripcionDetalle: string | null;
  fecha: string;
  idConsulta: number;
  idDiagnostico: number;
}

export interface ConsultaDiagnosticoRequest {
  descripcionDetalle: string | null;
  fecha: string;
  idConsulta: number;
  idDiagnostico: number;
}

export interface ConsultaTratamiento {
  idConsultaTratamiento: number;
  descripcion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  estado: string | null;
  idConsulta: number;
  idTratamiento: number;
  idServicio: number | null;
}

export interface ConsultaTratamientoRequest {
  descripcion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  estado: string | null;
  idConsulta: number;
  idTratamiento: number;
  idServicio: number | null;
}

export interface Receta {
  idReceta: number;
  medicamento: string;
  dosis: string | null;
  frecuencia: string | null;
  duracion: string | null;
  indicaciones: string | null;
  fecha: string;
  idConsulta: number;
}

export interface RecetaRequest {
  medicamento: string;
  dosis: string | null;
  frecuencia: string | null;
  duracion: string | null;
  indicaciones: string | null;
  fecha: string;
  idConsulta: number;
}

export interface ConsultaNota {
  idNota: number;
  nota: string;
  fecha: string;
  idConsulta: number;
  idDoctor: number;
  idUsuarioCreacion: number;
}

export interface ConsultaNotaRequest {
  nota: string;
  idConsulta: number;
  idDoctor: number;
  idUsuarioCreacion: number;
}
