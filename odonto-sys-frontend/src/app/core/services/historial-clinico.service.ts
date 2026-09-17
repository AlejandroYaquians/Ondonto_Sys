import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { HistorialClinico, HistorialClinicoRequest } from '../models/historial-clinico.models';

@Injectable({ providedIn: 'root' })
export class HistorialClinicoService {
  private readonly http = inject(HttpClient);

  listar(): Observable<HistorialClinico[]> {
    return this.http.get<HistorialClinico[]>(`${API_BASE_URL}/historial-clinico`);
  }

  listarPorPaciente(idPaciente: number): Observable<HistorialClinico[]> {
    return this.http.get<HistorialClinico[]>(`${API_BASE_URL}/historial-clinico`, { params: { idPaciente } });
  }

  buscarPorId(id: number): Observable<HistorialClinico> {
    return this.http.get<HistorialClinico>(`${API_BASE_URL}/historial-clinico/${id}`);
  }

  actualizar(id: number, request: HistorialClinicoRequest): Observable<HistorialClinico> {
    return this.http.put<HistorialClinico>(`${API_BASE_URL}/historial-clinico/${id}`, request);
  }
}
