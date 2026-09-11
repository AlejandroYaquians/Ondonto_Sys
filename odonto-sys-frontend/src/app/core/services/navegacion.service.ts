import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { ModuloConMenus } from '../models/menu.models';

@Injectable({ providedIn: 'root' })
export class NavegacionService {
  private readonly http = inject(HttpClient);

  obtenerNavegacion(): Observable<ModuloConMenus[]> {
    return this.http.get<ModuloConMenus[]>(`${API_BASE_URL}/navegacion`);
  }
}
