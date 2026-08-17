import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { InsumoMovimiento, InsumoMovimientoRequest } from '../models/insumo.models';

@Injectable({ providedIn: 'root' })
export class InsumoMovimientoService {
  private readonly http = inject(HttpClient);

  listarPorInsumo(idInsumo: number): Observable<InsumoMovimiento[]> {
    return this.http.get<InsumoMovimiento[]>(`${API_BASE_URL}/insumo-movimientos`, { params: { idInsumo } });
  }

  crear(request: InsumoMovimientoRequest): Observable<InsumoMovimiento> {
    return this.http.post<InsumoMovimiento>(`${API_BASE_URL}/insumo-movimientos`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/insumo-movimientos/${id}`);
  }
}
