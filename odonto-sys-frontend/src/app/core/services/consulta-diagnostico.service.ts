import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { ConsultaDiagnostico, ConsultaDiagnosticoRequest } from '../models/consulta.models';

@Injectable({ providedIn: 'root' })
export class ConsultaDiagnosticoService {
  private readonly http = inject(HttpClient);

  listarPorConsulta(idConsulta: number): Observable<ConsultaDiagnostico[]> {
    return this.http.get<ConsultaDiagnostico[]>(`${API_BASE_URL}/consulta-diagnosticos`, { params: { idConsulta } });
  }

  crear(request: ConsultaDiagnosticoRequest): Observable<ConsultaDiagnostico> {
    return this.http.post<ConsultaDiagnostico>(`${API_BASE_URL}/consulta-diagnosticos`, request);
  }

  actualizar(id: number, request: ConsultaDiagnosticoRequest): Observable<ConsultaDiagnostico> {
    return this.http.put<ConsultaDiagnostico>(`${API_BASE_URL}/consulta-diagnosticos/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/consulta-diagnosticos/${id}`);
  }
}
