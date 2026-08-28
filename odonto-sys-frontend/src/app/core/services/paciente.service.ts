import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Paciente, PacienteRequest } from '../models/paciente.models';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${API_BASE_URL}/pacientes`);
  }

  listarActivos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${API_BASE_URL}/pacientes`, { params: { activos: true } });
  }

  buscarPorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${API_BASE_URL}/pacientes/${id}`);
  }

  crear(request: PacienteRequest): Observable<Paciente> {
    return this.http.post<Paciente>(`${API_BASE_URL}/pacientes`, request);
  }

  actualizar(id: number, request: PacienteRequest): Observable<Paciente> {
    return this.http.put<Paciente>(`${API_BASE_URL}/pacientes/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/pacientes/${id}`);
  }
}
