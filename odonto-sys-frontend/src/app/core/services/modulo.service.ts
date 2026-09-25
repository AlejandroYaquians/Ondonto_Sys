import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Modulo } from '../models/modulo.models';

@Injectable({ providedIn: 'root' })
export class ModuloService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${API_BASE_URL}/modulos`);
  }
}
