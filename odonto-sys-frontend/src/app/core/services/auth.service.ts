import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { LoginRequest, LoginResponse } from '../models/auth.models';
import { AccesoService } from './acceso.service';

const TOKEN_KEY = 'odonto_token';
const ID_USUARIO_KEY = 'odonto_id_usuario';
const NOMBRE_KEY = 'odonto_nombre';
const APELLIDO_KEY = 'odonto_apellido';
const USERNAME_KEY = 'odonto_username';
const ROL_KEY = 'odonto_rol';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly accesoService = inject(AccesoService);

  readonly idUsuario = signal<number | null>(this.leerIdUsuarioAlmacenado());
  readonly nombre = signal<string | null>(localStorage.getItem(NOMBRE_KEY));
  readonly apellido = signal<string | null>(localStorage.getItem(APELLIDO_KEY));
  readonly username = signal<string | null>(localStorage.getItem(USERNAME_KEY));
  readonly rol = signal<string | null>(localStorage.getItem(ROL_KEY));

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credenciales).pipe(
      tap((respuesta) => {
        localStorage.setItem(TOKEN_KEY, respuesta.token);
        localStorage.setItem(ID_USUARIO_KEY, String(respuesta.idUsuario));
        localStorage.setItem(NOMBRE_KEY, respuesta.nombre);
        localStorage.setItem(APELLIDO_KEY, respuesta.apellido);
        localStorage.setItem(USERNAME_KEY, respuesta.username);
        localStorage.setItem(ROL_KEY, respuesta.rol);
        this.idUsuario.set(respuesta.idUsuario);
        this.nombre.set(respuesta.nombre);
        this.apellido.set(respuesta.apellido);
        this.username.set(respuesta.username);
        this.rol.set(respuesta.rol);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ID_USUARIO_KEY);
    localStorage.removeItem(NOMBRE_KEY);
    localStorage.removeItem(APELLIDO_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROL_KEY);
    this.idUsuario.set(null);
    this.nombre.set(null);
    this.apellido.set(null);
    this.username.set(null);
    this.rol.set(null);
    this.accesoService.limpiar();
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private leerIdUsuarioAlmacenado(): number | null {
    const valor = localStorage.getItem(ID_USUARIO_KEY);
    return valor ? Number(valor) : null;
  }
}
