import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Doctor, DoctorRequest } from '../models/doctor.models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${API_BASE_URL}/doctores`);
  }

  listarActivos(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${API_BASE_URL}/doctores`, { params: { activos: true } });
  }

  buscarPorId(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${API_BASE_URL}/doctores/${id}`);
  }

  crear(request: DoctorRequest): Observable<Doctor> {
    return this.http.post<Doctor>(`${API_BASE_URL}/doctores`, request);
  }

  actualizar(id: number, request: DoctorRequest): Observable<Doctor> {
    return this.http.put<Doctor>(`${API_BASE_URL}/doctores/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/doctores/${id}`);
  }
}
