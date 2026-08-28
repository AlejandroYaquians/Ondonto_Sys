import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Permiso, PermisoRequest } from '../models/permiso.models';

@Injectable({ providedIn: 'root' })
export class PermisoService {
  private readonly http = inject(HttpClient);

  listarPorRol(idRol: number): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${API_BASE_URL}/permisos`, { params: { idRol } });
  }

  crear(request: PermisoRequest): Observable<Permiso> {
    return this.http.post<Permiso>(`${API_BASE_URL}/permisos`, request);
  }

  actualizar(id: number, request: PermisoRequest): Observable<Permiso> {
    return this.http.put<Permiso>(`${API_BASE_URL}/permisos/${id}`, request);
  }
}
