import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { ReporteFinanciero } from '../models/reporte-financiero.models';

@Injectable({ providedIn: 'root' })
export class ReporteFinancieroService {
  private readonly http = inject(HttpClient);

  generar(desde: string, hasta: string): Observable<ReporteFinanciero> {
    return this.http.get<ReporteFinanciero>(`${API_BASE_URL}/reportes/financiero`, { params: { desde, hasta } });
  }

  descargarCsv(desde: string, hasta: string): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}/reportes/financiero/csv`, {
      params: { desde, hasta },
      responseType: 'blob'
    });
  }
}
