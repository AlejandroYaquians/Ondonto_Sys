import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Insumo, InsumoRequest } from '../models/insumo.models';

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${API_BASE_URL}/insumos`);
  }

  buscarPorId(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${API_BASE_URL}/insumos/${id}`);
  }

  crear(request: InsumoRequest): Observable<Insumo> {
    return this.http.post<Insumo>(`${API_BASE_URL}/insumos`, request);
  }

  actualizar(id: number, request: InsumoRequest): Observable<Insumo> {
    return this.http.put<Insumo>(`${API_BASE_URL}/insumos/${id}`, request);
  }

  actualizarStockMinimo(id: number, stockMinimo: number): Observable<Insumo> {
    return this.http.patch<Insumo>(`${API_BASE_URL}/insumos/${id}/stock-minimo`, null, {
      params: { stockMinimo }
    });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/insumos/${id}`);
  }
}
