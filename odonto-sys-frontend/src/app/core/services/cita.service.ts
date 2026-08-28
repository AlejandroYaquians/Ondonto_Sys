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

  listarPorPaciente(idPaciente: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${API_BASE_URL}/citas`, { params: { idPaciente } });
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

  cambiarEstado(id: number, estado: string): Observable<Cita> {
    return this.http.patch<Cita>(`${API_BASE_URL}/citas/${id}/estado`, null, { params: { estado } });
  }

  cambiarDoctor(id: number, idDoctor: number): Observable<Cita> {
    return this.http.patch<Cita>(`${API_BASE_URL}/citas/${id}/doctor`, null, { params: { idDoctor } });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/citas/${id}`);
  }
}
