import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Comision, ComisionRequest } from '../models/pago.models';

@Injectable({ providedIn: 'root' })
export class ComisionService {
  private readonly http = inject(HttpClient);

  listarPorPago(idPago: number): Observable<Comision[]> {
    return this.http.get<Comision[]>(`${API_BASE_URL}/comisiones`, { params: { idPago } });
  }

  listarPorDoctorYEstado(idDoctor: number, estado: string): Observable<Comision[]> {
    return this.http.get<Comision[]>(`${API_BASE_URL}/comisiones`, { params: { idDoctor, estado } });
  }

  crear(request: ComisionRequest): Observable<Comision> {
    return this.http.post<Comision>(`${API_BASE_URL}/comisiones`, request);
  }

  cambiarEstado(id: number, estado: string): Observable<Comision> {
    return this.http.patch<Comision>(`${API_BASE_URL}/comisiones/${id}/estado`, null, { params: { estado } });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/comisiones/${id}`);
  }
}
