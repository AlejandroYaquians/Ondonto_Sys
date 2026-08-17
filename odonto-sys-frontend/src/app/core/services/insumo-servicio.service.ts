import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { InsumoServicio, InsumoServicioRequest } from '../models/insumo.models';

@Injectable({ providedIn: 'root' })
export class InsumoServicioService {
  private readonly http = inject(HttpClient);

  listarPorServicio(idServicio: number): Observable<InsumoServicio[]> {
    return this.http.get<InsumoServicio[]>(`${API_BASE_URL}/insumo-servicios`, { params: { idServicio } });
  }

  crear(request: InsumoServicioRequest): Observable<InsumoServicio> {
    return this.http.post<InsumoServicio>(`${API_BASE_URL}/insumo-servicios`, request);
  }

  actualizar(id: number, request: InsumoServicioRequest): Observable<InsumoServicio> {
    return this.http.put<InsumoServicio>(`${API_BASE_URL}/insumo-servicios/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/insumo-servicios/${id}`);
  }
}
