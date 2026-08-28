import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { HistorialClinicoCobroRequest, HistorialClinicoCobroResponse } from '../models/historial-clinico-cobro.models';

@Injectable({ providedIn: 'root' })
export class HistorialClinicoCobroService {
  private readonly http = inject(HttpClient);

  registrar(request: HistorialClinicoCobroRequest): Observable<HistorialClinicoCobroResponse> {
    return this.http.post<HistorialClinicoCobroResponse>(`${API_BASE_URL}/historial-clinico-cobro`, request);
  }
}
