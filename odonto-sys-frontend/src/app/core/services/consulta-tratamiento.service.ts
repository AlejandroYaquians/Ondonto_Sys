import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { ConsultaTratamiento, ConsultaTratamientoRequest } from '../models/consulta.models';

@Injectable({ providedIn: 'root' })
export class ConsultaTratamientoService {
  private readonly http = inject(HttpClient);

  listarPorConsulta(idConsulta: number): Observable<ConsultaTratamiento[]> {
    return this.http.get<ConsultaTratamiento[]>(`${API_BASE_URL}/consulta-tratamientos`, { params: { idConsulta } });
  }

  crear(request: ConsultaTratamientoRequest): Observable<ConsultaTratamiento> {
    return this.http.post<ConsultaTratamiento>(`${API_BASE_URL}/consulta-tratamientos`, request);
  }

  actualizar(id: number, request: ConsultaTratamientoRequest): Observable<ConsultaTratamiento> {
    return this.http.put<ConsultaTratamiento>(`${API_BASE_URL}/consulta-tratamientos/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/consulta-tratamientos/${id}`);
  }
}
