import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { AntecedenteMedico, AntecedenteMedicoRequest } from '../models/antecedente-medico.models';

@Injectable({ providedIn: 'root' })
export class AntecedenteMedicoService {
  private readonly http = inject(HttpClient);

  listarPorPaciente(idPaciente: number): Observable<AntecedenteMedico[]> {
    return this.http.get<AntecedenteMedico[]>(`${API_BASE_URL}/antecedentes-medicos`, { params: { idPaciente } });
  }

  crear(request: AntecedenteMedicoRequest): Observable<AntecedenteMedico> {
    return this.http.post<AntecedenteMedico>(`${API_BASE_URL}/antecedentes-medicos`, request);
  }

  actualizar(id: number, request: AntecedenteMedicoRequest): Observable<AntecedenteMedico> {
    return this.http.put<AntecedenteMedico>(`${API_BASE_URL}/antecedentes-medicos/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/antecedentes-medicos/${id}`);
  }
}
