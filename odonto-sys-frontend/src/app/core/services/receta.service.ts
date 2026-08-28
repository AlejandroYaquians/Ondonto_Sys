import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Receta, RecetaRequest } from '../models/receta.models';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private readonly http = inject(HttpClient);

  listarPorHistorialClinico(idHistorialClinico: number): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${API_BASE_URL}/recetas`, { params: { idHistorialClinico } });
  }

  listarPorPaciente(idPaciente: number): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${API_BASE_URL}/recetas`, { params: { idPaciente } });
  }

  crear(request: RecetaRequest): Observable<Receta> {
    return this.http.post<Receta>(`${API_BASE_URL}/recetas`, request);
  }

  actualizar(id: number, request: RecetaRequest): Observable<Receta> {
    return this.http.put<Receta>(`${API_BASE_URL}/recetas/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/recetas/${id}`);
  }
}
