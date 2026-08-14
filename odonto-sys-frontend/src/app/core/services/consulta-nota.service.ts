import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { ConsultaNota, ConsultaNotaRequest } from '../models/consulta.models';

@Injectable({ providedIn: 'root' })
export class ConsultaNotaService {
  private readonly http = inject(HttpClient);

  listarPorConsulta(idConsulta: number): Observable<ConsultaNota[]> {
    return this.http.get<ConsultaNota[]>(`${API_BASE_URL}/consulta-notas`, { params: { idConsulta } });
  }

  crear(request: ConsultaNotaRequest): Observable<ConsultaNota> {
    return this.http.post<ConsultaNota>(`${API_BASE_URL}/consulta-notas`, request);
  }

  actualizar(id: number, request: ConsultaNotaRequest): Observable<ConsultaNota> {
    return this.http.put<ConsultaNota>(`${API_BASE_URL}/consulta-notas/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/consulta-notas/${id}`);
  }
}
