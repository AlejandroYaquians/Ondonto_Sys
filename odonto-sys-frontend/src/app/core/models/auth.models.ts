export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  idUsuario: number;
  username: string;
  rol: string;
}
