import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Cita, CitaRequest } from '../models/cita.models';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${API_BASE_URL}/citas`);
  }

  buscarPorId(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${API_BASE_URL}/citas/${id}`);
  }

  crear(request: CitaRequest): Observable<Cita> {
    return this.http.post<Cita>(`${API_BASE_URL}/citas`, request);
  }

  actualizar(id: number, request: CitaRequest): Observable<Cita> {
    return this.http.put<Cita>(`${API_BASE_URL}/citas/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/citas/${id}`);
  }
}
