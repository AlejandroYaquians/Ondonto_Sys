import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Bitacora } from '../models/bitacora.models';

@Injectable({ providedIn: 'root' })
export class BitacoraService {
  private readonly http = inject(HttpClient);

  listarPorRegistro(tablaAfectada: string, idRegistro: number): Observable<Bitacora[]> {
    return this.http.get<Bitacora[]>(`${API_BASE_URL}/bitacora`, { params: { tablaAfectada, idRegistro } });
  }

  listarPorUsuario(idUsuario: number): Observable<Bitacora[]> {
    return this.http.get<Bitacora[]>(`${API_BASE_URL}/bitacora`, { params: { idUsuario } });
  }
}
