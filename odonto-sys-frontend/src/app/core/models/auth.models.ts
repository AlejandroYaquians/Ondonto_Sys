export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  idUsuario: number;
  nombre: string;
  apellido: string;
  username: string;
  rol: string;
}
