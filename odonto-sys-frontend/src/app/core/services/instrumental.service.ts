import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Instrumental, InstrumentalRequest } from '../models/instrumental.models';

@Injectable({ providedIn: 'root' })
export class InstrumentalService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Instrumental[]> {
    return this.http.get<Instrumental[]>(`${API_BASE_URL}/instrumental`);
  }

  listarActivos(): Observable<Instrumental[]> {
    return this.http.get<Instrumental[]>(`${API_BASE_URL}/instrumental`, { params: { activos: true } });
  }

  buscarPorId(id: number): Observable<Instrumental> {
    return this.http.get<Instrumental>(`${API_BASE_URL}/instrumental/${id}`);
  }

  crear(request: InstrumentalRequest): Observable<Instrumental> {
    return this.http.post<Instrumental>(`${API_BASE_URL}/instrumental`, request);
  }

  actualizar(id: number, request: InstrumentalRequest): Observable<Instrumental> {
    return this.http.put<Instrumental>(`${API_BASE_URL}/instrumental/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/instrumental/${id}`);
  }
}
