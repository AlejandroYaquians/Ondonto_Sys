import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { CambiarPasswordRequest, Perfil } from '../models/perfil.models';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly http = inject(HttpClient);

  obtenerPerfil(): Observable<Perfil> {
    return this.http.get<Perfil>(`${API_BASE_URL}/perfil`);
  }

  cambiarPassword(request: CambiarPasswordRequest): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/perfil/password`, request);
  }
}
