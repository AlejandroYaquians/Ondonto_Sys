import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import {
  CatAfeccion,
  CatAfeccionRequest,
  CatDiagnostico,
  CatDiagnosticoRequest,
  CatEspecialidad,
  CatEspecialidadRequest,
  CatEstadoCita,
  CatEstadoCitaRequest,
  CatGasto,
  CatGastoRequest,
  CatGenero,
  CatGeneroRequest,
  CatMetodoPago,
  CatMetodoPagoRequest,
  CatMovimiento,
  CatMovimientoRequest,
  CatParentesco,
  CatParentescoRequest,
  CatProfesion,
  CatProfesionRequest,
  CatTratamiento,
  CatTratamientoRequest,
  Departamento,
  DepartamentoRequest,
  Municipio,
  MunicipioRequest,
  Servicio,
  ServicioRequest
} from '../models/catalogo.models';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private readonly http = inject(HttpClient);

  generos(): Observable<CatGenero[]> {
    return this.http.get<CatGenero[]>(`${API_BASE_URL}/catalogos/generos`);
  }

  crearGenero(request: CatGeneroRequest): Observable<CatGenero> {
    return this.http.post<CatGenero>(`${API_BASE_URL}/catalogos/generos`, request);
  }

  actualizarGenero(id: number, request: CatGeneroRequest): Observable<CatGenero> {
    return this.http.put<CatGenero>(`${API_BASE_URL}/catalogos/generos/${id}`, request);
  }

  eliminarGenero(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/generos/${id}`);
  }

  profesiones(): Observable<CatProfesion[]> {
    return this.http.get<CatProfesion[]>(`${API_BASE_URL}/catalogos/profesiones`);
  }

  crearProfesion(request: CatProfesionRequest): Observable<CatProfesion> {
    return this.http.post<CatProfesion>(`${API_BASE_URL}/catalogos/profesiones`, request);
  }

  actualizarProfesion(id: number, request: CatProfesionRequest): Observable<CatProfesion> {
    return this.http.put<CatProfesion>(`${API_BASE_URL}/catalogos/profesiones/${id}`, request);
  }

  eliminarProfesion(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/profesiones/${id}`);
  }

  departamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${API_BASE_URL}/departamentos`);
  }

  crearDepartamento(request: DepartamentoRequest): Observable<Departamento> {
    return this.http.post<Departamento>(`${API_BASE_URL}/departamentos`, request);
  }

  actualizarDepartamento(id: number, request: DepartamentoRequest): Observable<Departamento> {
    return this.http.put<Departamento>(`${API_BASE_URL}/departamentos/${id}`, request);
  }

  eliminarDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/departamentos/${id}`);
  }

  municipios(idDepartamento?: number): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${API_BASE_URL}/municipios`, {
      params: idDepartamento ? { idDepartamento } : {}
    });
  }

  crearMunicipio(request: MunicipioRequest): Observable<Municipio> {
    return this.http.post<Municipio>(`${API_BASE_URL}/municipios`, request);
  }

  actualizarMunicipio(id: number, request: MunicipioRequest): Observable<Municipio> {
    return this.http.put<Municipio>(`${API_BASE_URL}/municipios/${id}`, request);
  }

  eliminarMunicipio(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/municipios/${id}`);
  }

  estadosCita(): Observable<CatEstadoCita[]> {
    return this.http.get<CatEstadoCita[]>(`${API_BASE_URL}/catalogos/estados-cita`);
  }

  crearEstadoCita(request: CatEstadoCitaRequest): Observable<CatEstadoCita> {
    return this.http.post<CatEstadoCita>(`${API_BASE_URL}/catalogos/estados-cita`, request);
  }

  actualizarEstadoCita(id: number, request: CatEstadoCitaRequest): Observable<CatEstadoCita> {
    return this.http.put<CatEstadoCita>(`${API_BASE_URL}/catalogos/estados-cita/${id}`, request);
  }

  eliminarEstadoCita(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/estados-cita/${id}`);
  }

  especialidades(): Observable<CatEspecialidad[]> {
    return this.http.get<CatEspecialidad[]>(`${API_BASE_URL}/catalogos/especialidades`);
  }

  crearEspecialidad(request: CatEspecialidadRequest): Observable<CatEspecialidad> {
    return this.http.post<CatEspecialidad>(`${API_BASE_URL}/catalogos/especialidades`, request);
  }

  actualizarEspecialidad(id: number, request: CatEspecialidadRequest): Observable<CatEspecialidad> {
    return this.http.put<CatEspecialidad>(`${API_BASE_URL}/catalogos/especialidades/${id}`, request);
  }

  eliminarEspecialidad(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/especialidades/${id}`);
  }

  diagnosticos(): Observable<CatDiagnostico[]> {
    return this.http.get<CatDiagnostico[]>(`${API_BASE_URL}/catalogos/diagnosticos`);
  }

  crearDiagnostico(request: CatDiagnosticoRequest): Observable<CatDiagnostico> {
    return this.http.post<CatDiagnostico>(`${API_BASE_URL}/catalogos/diagnosticos`, request);
  }

  actualizarDiagnostico(id: number, request: CatDiagnosticoRequest): Observable<CatDiagnostico> {
    return this.http.put<CatDiagnostico>(`${API_BASE_URL}/catalogos/diagnosticos/${id}`, request);
  }

  eliminarDiagnostico(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/diagnosticos/${id}`);
  }

  tratamientos(): Observable<CatTratamiento[]> {
    return this.http.get<CatTratamiento[]>(`${API_BASE_URL}/catalogos/tratamientos`);
  }

  crearTratamiento(request: CatTratamientoRequest): Observable<CatTratamiento> {
    return this.http.post<CatTratamiento>(`${API_BASE_URL}/catalogos/tratamientos`, request);
  }

  actualizarTratamiento(id: number, request: CatTratamientoRequest): Observable<CatTratamiento> {
    return this.http.put<CatTratamiento>(`${API_BASE_URL}/catalogos/tratamientos/${id}`, request);
  }

  eliminarTratamiento(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/tratamientos/${id}`);
  }

  servicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${API_BASE_URL}/servicios`, { params: { activos: true } });
  }

  crearServicio(request: ServicioRequest): Observable<Servicio> {
    return this.http.post<Servicio>(`${API_BASE_URL}/servicios`, request);
  }

  actualizarServicio(id: number, request: ServicioRequest): Observable<Servicio> {
    return this.http.put<Servicio>(`${API_BASE_URL}/servicios/${id}`, request);
  }

  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/servicios/${id}`);
  }

  afecciones(): Observable<CatAfeccion[]> {
    return this.http.get<CatAfeccion[]>(`${API_BASE_URL}/catalogos/afecciones`);
  }

  crearAfeccion(request: CatAfeccionRequest): Observable<CatAfeccion> {
    return this.http.post<CatAfeccion>(`${API_BASE_URL}/catalogos/afecciones`, request);
  }

  actualizarAfeccion(id: number, request: CatAfeccionRequest): Observable<CatAfeccion> {
    return this.http.put<CatAfeccion>(`${API_BASE_URL}/catalogos/afecciones/${id}`, request);
  }

  eliminarAfeccion(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/afecciones/${id}`);
  }

  parentescos(): Observable<CatParentesco[]> {
    return this.http.get<CatParentesco[]>(`${API_BASE_URL}/catalogos/parentescos`);
  }

  crearParentesco(request: CatParentescoRequest): Observable<CatParentesco> {
    return this.http.post<CatParentesco>(`${API_BASE_URL}/catalogos/parentescos`, request);
  }

  actualizarParentesco(id: number, request: CatParentescoRequest): Observable<CatParentesco> {
    return this.http.put<CatParentesco>(`${API_BASE_URL}/catalogos/parentescos/${id}`, request);
  }

  eliminarParentesco(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/parentescos/${id}`);
  }

  tiposGasto(): Observable<CatGasto[]> {
    return this.http.get<CatGasto[]>(`${API_BASE_URL}/catalogos/tipos-gasto`);
  }

  crearTipoGasto(request: CatGastoRequest): Observable<CatGasto> {
    return this.http.post<CatGasto>(`${API_BASE_URL}/catalogos/tipos-gasto`, request);
  }

  actualizarTipoGasto(id: number, request: CatGastoRequest): Observable<CatGasto> {
    return this.http.put<CatGasto>(`${API_BASE_URL}/catalogos/tipos-gasto/${id}`, request);
  }

  eliminarTipoGasto(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/tipos-gasto/${id}`);
  }

  metodosPago(): Observable<CatMetodoPago[]> {
    return this.http.get<CatMetodoPago[]>(`${API_BASE_URL}/catalogos/metodos-pago`);
  }

  crearMetodoPago(request: CatMetodoPagoRequest): Observable<CatMetodoPago> {
    return this.http.post<CatMetodoPago>(`${API_BASE_URL}/catalogos/metodos-pago`, request);
  }

  actualizarMetodoPago(id: number, request: CatMetodoPagoRequest): Observable<CatMetodoPago> {
    return this.http.put<CatMetodoPago>(`${API_BASE_URL}/catalogos/metodos-pago/${id}`, request);
  }

  eliminarMetodoPago(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/metodos-pago/${id}`);
  }

  tiposMovimiento(): Observable<CatMovimiento[]> {
    return this.http.get<CatMovimiento[]>(`${API_BASE_URL}/catalogos/tipos-movimiento`);
  }

  crearTipoMovimiento(request: CatMovimientoRequest): Observable<CatMovimiento> {
    return this.http.post<CatMovimiento>(`${API_BASE_URL}/catalogos/tipos-movimiento`, request);
  }

  actualizarTipoMovimiento(id: number, request: CatMovimientoRequest): Observable<CatMovimiento> {
    return this.http.put<CatMovimiento>(`${API_BASE_URL}/catalogos/tipos-movimiento/${id}`, request);
  }

  eliminarTipoMovimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/catalogos/tipos-movimiento/${id}`);
  }
}
