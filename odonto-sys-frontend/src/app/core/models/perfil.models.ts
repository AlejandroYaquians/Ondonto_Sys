export interface Perfil {
  idUsuario: number;
  nombre: string;
  apellido: string;
  username: string;
  estado: boolean;
  nombreRol: string;
}

export interface CambiarPasswordRequest {
  passwordActual: string;
  passwordNueva: string;
}
