export interface Doctor {
  idDoctor: number;
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  porcentajeComision: number;
  activo: boolean;
  idEspecialidad: number | null;
  idUsuario: number | null;
}

export interface DoctorRequest {
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  porcentajeComision: number;
  idEspecialidad: number | null;
  idUsuario: number | null;
}
