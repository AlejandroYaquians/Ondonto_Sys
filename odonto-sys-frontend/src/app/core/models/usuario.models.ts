export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string | null;
  username: string;
  estado: boolean;
  idRol: number;
}

export interface UsuarioRequest {
  nombre: string;
  apellido: string;
  username: string;
  password: string | null;
  idRol: number;
  idsEspecialidad: number[] | null;
  porcentajeComision: number | null;
}
