import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { PagoDetalle, PagoDetalleRequest } from '../models/pago.models';

@Injectable({ providedIn: 'root' })
export class PagoDetalleService {
  private readonly http = inject(HttpClient);

  listarPorPago(idPago: number): Observable<PagoDetalle[]> {
    return this.http.get<PagoDetalle[]>(`${API_BASE_URL}/pago-detalles`, { params: { idPago } });
  }

  crear(request: PagoDetalleRequest): Observable<PagoDetalle> {
    return this.http.post<PagoDetalle>(`${API_BASE_URL}/pago-detalles`, request);
  }

  actualizar(id: number, request: PagoDetalleRequest): Observable<PagoDetalle> {
    return this.http.put<PagoDetalle>(`${API_BASE_URL}/pago-detalles/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/pago-detalles/${id}`);
  }
}
