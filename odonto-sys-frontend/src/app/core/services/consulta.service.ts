import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Consulta, ConsultaRequest } from '../models/consulta.models';

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${API_BASE_URL}/consultas`);
  }

  buscarPorId(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${API_BASE_URL}/consultas/${id}`);
  }

  crear(request: ConsultaRequest): Observable<Consulta> {
    return this.http.post<Consulta>(`${API_BASE_URL}/consultas`, request);
  }

  actualizar(id: number, request: ConsultaRequest): Observable<Consulta> {
    return this.http.put<Consulta>(`${API_BASE_URL}/consultas/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/consultas/${id}`);
  }
}
