import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { MenuItem, MenuRequest } from '../models/menu.models';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);

  listar(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${API_BASE_URL}/menus`);
  }

  buscarPorId(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${API_BASE_URL}/menus/${id}`);
  }

  crear(request: MenuRequest): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${API_BASE_URL}/menus`, request);
  }

  actualizar(id: number, request: MenuRequest): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${API_BASE_URL}/menus/${id}`, request);
  }

  desactivar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/menus/${id}`);
  }
}
