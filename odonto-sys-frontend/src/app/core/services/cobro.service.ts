import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Cobro, CobroRequest } from '../models/cobro.models';

@Injectable({ providedIn: 'root' })
export class CobroService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Cobro[]> {
    return this.http.get<Cobro[]>(`${API_BASE_URL}/cobros`);
  }

  listarPorPaciente(idPaciente: number): Observable<Cobro[]> {
    return this.http.get<Cobro[]>(`${API_BASE_URL}/cobros`, { params: { idPaciente } });
  }

  listarPorCita(idCita: number): Observable<Cobro[]> {
    return this.http.get<Cobro[]>(`${API_BASE_URL}/cobros`, { params: { idCita } });
  }

  listarPorRango(
    desde: string,
    hasta: string,
    idDoctor: number | null,
    idMetodoPago: number | null
  ): Observable<Cobro[]> {
    const params: Record<string, string | number> = { desde, hasta };
    if (idDoctor !== null) {
      params['idDoctor'] = idDoctor;
    }
    if (idMetodoPago !== null) {
      params['idMetodoPago'] = idMetodoPago;
    }
    return this.http.get<Cobro[]>(`${API_BASE_URL}/cobros`, { params });
  }

  buscarPorId(id: number): Observable<Cobro> {
    return this.http.get<Cobro>(`${API_BASE_URL}/cobros/${id}`);
  }

  crear(request: CobroRequest): Observable<Cobro> {
    return this.http.post<Cobro>(`${API_BASE_URL}/cobros`, request);
  }

  cambiarEstado(id: number, estado: string): Observable<Cobro> {
    return this.http.patch<Cobro>(`${API_BASE_URL}/cobros/${id}/estado`, null, { params: { estado } });
  }
}
