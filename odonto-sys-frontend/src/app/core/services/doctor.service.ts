import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Doctor } from '../models/doctor.models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${API_BASE_URL}/doctores`);
  }

  listarActivos(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${API_BASE_URL}/doctores`, { params: { activos: true } });
  }
}
