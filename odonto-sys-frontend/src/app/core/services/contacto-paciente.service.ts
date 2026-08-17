import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { ContactoPaciente, ContactoPacienteRequest } from '../models/contacto-paciente.models';

@Injectable({ providedIn: 'root' })
export class ContactoPacienteService {
  private readonly http = inject(HttpClient);

  listarPorPaciente(idPaciente: number): Observable<ContactoPaciente[]> {
    return this.http.get<ContactoPaciente[]>(`${API_BASE_URL}/contactos-paciente`, { params: { idPaciente } });
  }

  crear(request: ContactoPacienteRequest): Observable<ContactoPaciente> {
    return this.http.post<ContactoPaciente>(`${API_BASE_URL}/contactos-paciente`, request);
  }

  actualizar(id: number, request: ContactoPacienteRequest): Observable<ContactoPaciente> {
    return this.http.put<ContactoPaciente>(`${API_BASE_URL}/contactos-paciente/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/contactos-paciente/${id}`);
  }
}
