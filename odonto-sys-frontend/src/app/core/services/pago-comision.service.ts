import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { ComisionAcumulada, PagoComision, RegistrarPagoRequest } from '../models/pago-comision.models';
import { Comision } from '../models/cobro.models';

@Injectable({ providedIn: 'root' })
export class PagoComisionService {
  private readonly http = inject(HttpClient);

  listarAcumulado(): Observable<ComisionAcumulada[]> {
    return this.http.get<ComisionAcumulada[]>(`${API_BASE_URL}/financiero/pago-comisiones`);
  }

  listarPendientes(idDoctor: number): Observable<Comision[]> {
    return this.http.get<Comision[]>(`${API_BASE_URL}/financiero/pago-comisiones/${idDoctor}/pendientes`);
  }

  historialPagos(idDoctor: number): Observable<PagoComision[]> {
    return this.http.get<PagoComision[]>(`${API_BASE_URL}/financiero/pago-comisiones/${idDoctor}/historial`);
  }

  registrarPago(idDoctor: number, request: RegistrarPagoRequest): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/financiero/pago-comisiones/${idDoctor}/pagar`, request);
  }
}
