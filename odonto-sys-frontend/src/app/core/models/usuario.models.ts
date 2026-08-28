export interface Usuario {
  idUsuario: number;
  nombre: string;
  username: string;
  estado: boolean;
  idRol: number;
}

export interface UsuarioRequest {
  nombre: string;
  username: string;
  password: string;
  idRol: number;
  apellido: string | null;
  idsEspecialidad: number[] | null;
  porcentajeComision: number | null;
}
