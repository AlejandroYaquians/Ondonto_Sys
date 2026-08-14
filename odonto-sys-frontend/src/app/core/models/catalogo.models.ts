export interface CatGenero {
  idGenero: number;
  nombre: string;
}

export interface CatGeneroRequest {
  nombre: string;
}

export interface CatProfesion {
  idProfesion: number;
  nombre: string;
}

export interface CatProfesionRequest {
  nombre: string;
}

export interface Departamento {
  idDepartamento: number;
  nombre: string;
}

export interface DepartamentoRequest {
  nombre: string;
}

export interface Municipio {
  idMunicipio: number;
  nombre: string;
  idDepartamento: number;
}

export interface MunicipioRequest {
  nombre: string;
  idDepartamento: number;
}

export interface CatEstadoCita {
  idEstadoCita: number;
  nombre: string;
}

export interface CatEstadoCitaRequest {
  nombre: string;
}

export interface CatEspecialidad {
  idEspecialidad: number;
  nombre: string;
}

export interface CatEspecialidadRequest {
  nombre: string;
}

export interface CatDiagnostico {
  idDiagnostico: number;
  nombre: string;
  descripcion: string | null;
}

export interface CatDiagnosticoRequest {
  nombre: string;
  descripcion: string | null;
}

export interface CatTratamiento {
  idTratamiento: number;
  nombre: string;
  descripcion: string | null;
}

export interface CatTratamientoRequest {
  nombre: string;
  descripcion: string | null;
}

export interface Servicio {
  idServicio: number;
  nombre: string;
  descripcion: string | null;
  costoBase: number;
  activo: boolean;
}

export interface ServicioRequest {
  nombre: string;
  descripcion: string | null;
  costoBase: number;
}

export interface CatAfeccion {
  idAfeccion: number;
  nombreAfeccion: string;
  tipo: string | null;
}

export interface CatAfeccionRequest {
  nombreAfeccion: string;
  tipo: string | null;
}

export interface CatParentesco {
  idParentesco: number;
  nombre: string;
}

export interface CatParentescoRequest {
  nombre: string;
}

export interface CatGasto {
  idTipoGasto: number;
  nombreCategoria: string;
  tipo: string | null;
}

export interface CatGastoRequest {
  nombreCategoria: string;
  tipo: string | null;
}

export interface CatMetodoPago {
  idMetodoPago: number;
  nombre: string;
  comisionPorcentaje: number | null;
}

export interface CatMetodoPagoRequest {
  nombre: string;
  comisionPorcentaje: number | null;
}

export interface CatMovimiento {
  idTipoMovimiento: number;
  nombreMovimiento: string;
  operacion: boolean;
}

export interface CatMovimientoRequest {
  nombreMovimiento: string;
  operacion: boolean;
}
