import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { CatEstadoCita, CatGenero, CatProfesion, Departamento, Municipio } from '../models/catalogo.models';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private readonly http = inject(HttpClient);

  generos(): Observable<CatGenero[]> {
    return this.http.get<CatGenero[]>(`${API_BASE_URL}/catalogos/generos`);
  }

  profesiones(): Observable<CatProfesion[]> {
    return this.http.get<CatProfesion[]>(`${API_BASE_URL}/catalogos/profesiones`);
  }

  departamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${API_BASE_URL}/departamentos`);
  }

  municipios(idDepartamento?: number): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${API_BASE_URL}/municipios`, {
      params: idDepartamento ? { idDepartamento } : {}
    });
  }

  estadosCita(): Observable<CatEstadoCita[]> {
    return this.http.get<CatEstadoCita[]>(`${API_BASE_URL}/catalogos/estados-cita`);
  }
}
