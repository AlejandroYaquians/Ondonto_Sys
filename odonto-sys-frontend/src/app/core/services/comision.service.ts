import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Comision } from '../models/cobro.models';

@Injectable({ providedIn: 'root' })
export class ComisionService {
  private readonly http = inject(HttpClient);

  listarPorCobro(idCobro: number): Observable<Comision[]> {
    return this.http.get<Comision[]>(`${API_BASE_URL}/comisiones`, { params: { idCobro } });
  }

  listarPorDoctorYEstado(idDoctor: number, estado: string): Observable<Comision[]> {
    return this.http.get<Comision[]>(`${API_BASE_URL}/comisiones`, { params: { idDoctor, estado } });
  }

  listarPorRango(desde: string, hasta: string, idDoctor: number | null): Observable<Comision[]> {
    const params: Record<string, string | number> = { desde, hasta };
    if (idDoctor !== null) {
      params['idDoctor'] = idDoctor;
    }
    return this.http.get<Comision[]>(`${API_BASE_URL}/comisiones`, { params });
  }

  cambiarEstado(id: number, estado: string): Observable<Comision> {
    return this.http.patch<Comision>(`${API_BASE_URL}/comisiones/${id}/estado`, null, { params: { estado } });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/comisiones/${id}`);
  }
}
