import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { HistorialMedico, HistorialMedicoRequest } from '../models/historial-medico.models';

@Injectable({ providedIn: 'root' })
export class HistorialMedicoService {
  private readonly http = inject(HttpClient);

  listarPorPaciente(idPaciente: number): Observable<HistorialMedico[]> {
    return this.http.get<HistorialMedico[]>(`${API_BASE_URL}/historial-medico`, { params: { idPaciente } });
  }

  crear(request: HistorialMedicoRequest): Observable<HistorialMedico> {
    return this.http.post<HistorialMedico>(`${API_BASE_URL}/historial-medico`, request);
  }

  actualizar(id: number, request: HistorialMedicoRequest): Observable<HistorialMedico> {
    return this.http.put<HistorialMedico>(`${API_BASE_URL}/historial-medico/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/historial-medico/${id}`);
  }
}
