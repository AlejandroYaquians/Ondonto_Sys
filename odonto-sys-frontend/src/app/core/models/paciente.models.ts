export interface Paciente {
  idPaciente: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  referidoPor: string | null;
  medicoFamilia: string | null;
  activo: boolean;
  fechaRegistro: string;
  idGenero: number | null;
  idProfesion: number | null;
  idMunicipio: number | null;
}

export interface PacienteRequest {
  nombre: string;
  apellido: string;
  fechaNacimiento: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  referidoPor: string | null;
  medicoFamilia: string | null;
  idGenero: number | null;
  idProfesion: number | null;
  idMunicipio: number | null;
}
