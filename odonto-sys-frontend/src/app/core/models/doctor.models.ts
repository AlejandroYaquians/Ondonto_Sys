export interface Doctor {
  idDoctor: number;
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  porcentajeComision: number;
  activo: boolean;
  idsEspecialidad: number[];
  idUsuario: number | null;
}

export interface DoctorRequest {
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  porcentajeComision: number;
  idsEspecialidad: number[];
  idUsuario: number | null;
}
