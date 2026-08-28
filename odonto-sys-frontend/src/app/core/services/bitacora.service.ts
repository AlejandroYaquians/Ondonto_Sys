import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Bitacora, PaginaBitacora } from '../models/bitacora.models';

@Injectable({ providedIn: 'root' })
export class BitacoraService {
  private readonly http = inject(HttpClient);

  listar(
    page: number,
    idUsuario: number | null,
    tablaAfectada: string | null,
    desde: string | null,
    hasta: string | null
  ): Observable<PaginaBitacora> {
    const params: Record<string, string | number> = { page };
    if (idUsuario !== null) {
      params['idUsuario'] = idUsuario;
    }
    if (tablaAfectada !== null && tablaAfectada !== '') {
      params['tablaAfectada'] = tablaAfectada;
    }
    if (desde !== null) {
      params['desde'] = desde;
    }
    if (hasta !== null) {
      params['hasta'] = hasta;
    }
    return this.http.get<PaginaBitacora>(`${API_BASE_URL}/bitacora`, { params });
  }

  buscarPorId(id: number): Observable<Bitacora> {
    return this.http.get<Bitacora>(`${API_BASE_URL}/bitacora/${id}`);
  }
}
