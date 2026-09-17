import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { InstrumentalMovimiento, InstrumentalMovimientoRequest } from '../models/instrumental.models';

@Injectable({ providedIn: 'root' })
export class InstrumentalMovimientoService {
  private readonly http = inject(HttpClient);

  listarPorInstrumental(idInstrumental: number): Observable<InstrumentalMovimiento[]> {
    return this.http.get<InstrumentalMovimiento[]>(`${API_BASE_URL}/instrumental-movimientos`, {
      params: { idInstrumental }
    });
  }

  crear(request: InstrumentalMovimientoRequest): Observable<InstrumentalMovimiento> {
    return this.http.post<InstrumentalMovimiento>(`${API_BASE_URL}/instrumental-movimientos`, request);
  }
}
