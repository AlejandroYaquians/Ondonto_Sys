import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Gasto, GastoRequest } from '../models/gasto.models';

@Injectable({ providedIn: 'root' })
export class GastoService {
  private readonly http = inject(HttpClient);

  listarPorRango(desde: string, hasta: string, idTipoGasto: number | null): Observable<Gasto[]> {
    const params: Record<string, string | number> = { desde, hasta };
    if (idTipoGasto !== null) {
      params['idTipoGasto'] = idTipoGasto;
    }
    return this.http.get<Gasto[]>(`${API_BASE_URL}/gastos`, { params });
  }

  crear(request: GastoRequest): Observable<Gasto> {
    return this.http.post<Gasto>(`${API_BASE_URL}/gastos`, request);
  }

  actualizar(id: number, request: GastoRequest): Observable<Gasto> {
    return this.http.put<Gasto>(`${API_BASE_URL}/gastos/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/gastos/${id}`);
  }
}
