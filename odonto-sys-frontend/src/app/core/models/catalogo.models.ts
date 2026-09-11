export interface CatGenero {
  idGenero: number;
  nombre: string;
  activo: boolean;
}

export interface CatGeneroRequest {
  nombre: string;
}

export interface CatProfesion {
  idProfesion: number;
  nombre: string;
  activo: boolean;
}

export interface CatProfesionRequest {
  nombre: string;
}

export interface Departamento {
  idDepartamento: number;
  nombre: string;
  activo: boolean;
}

export interface DepartamentoRequest {
  nombre: string;
}

export interface Municipio {
  idMunicipio: number;
  nombre: string;
  idDepartamento: number;
  activo: boolean;
}

export interface MunicipioRequest {
  nombre: string;
  idDepartamento: number;
}

export interface CatEstadoCita {
  idEstadoCita: number;
  nombre: string;
}

export interface CatMotivoCita {
  idMotivoCita: number;
  nombre: string;
}

export interface CatEspecialidad {
  idEspecialidad: number;
  nombre: string;
  activo: boolean;
}

export interface CatEspecialidadRequest {
  nombre: string;
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
  activo: boolean;
}

export interface CatAfeccionRequest {
  nombreAfeccion: string;
}

export interface CatParentesco {
  idParentesco: number;
  nombre: string;
  activo: boolean;
}

export interface CatParentescoRequest {
  nombre: string;
}

export interface CatGasto {
  idTipoGasto: number;
  nombreCategoria: string;
  tipo: string | null;
  activo: boolean;
}

export interface CatGastoRequest {
  nombreCategoria: string;
  tipo: string | null;
}

export interface CatMetodoPago {
  idMetodoPago: number;
  nombre: string;
  comisionPorcentaje: number | null;
  activo: boolean;
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
