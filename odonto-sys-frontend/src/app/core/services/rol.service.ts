import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Rol } from '../models/rol.models';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${API_BASE_URL}/roles`);
  }
}
