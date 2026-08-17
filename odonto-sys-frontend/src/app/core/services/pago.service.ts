import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Pago, PagoRequest } from '../models/pago.models';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${API_BASE_URL}/pagos`);
  }

  buscarPorId(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${API_BASE_URL}/pagos/${id}`);
  }

  crear(request: PagoRequest): Observable<Pago> {
    return this.http.post<Pago>(`${API_BASE_URL}/pagos`, request);
  }

  actualizar(id: number, request: PagoRequest): Observable<Pago> {
    return this.http.put<Pago>(`${API_BASE_URL}/pagos/${id}`, request);
  }

  cambiarEstado(id: number, estado: string): Observable<Pago> {
    return this.http.patch<Pago>(`${API_BASE_URL}/pagos/${id}/estado`, null, { params: { estado } });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/pagos/${id}`);
  }
}
