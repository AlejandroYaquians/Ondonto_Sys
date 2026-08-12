export interface CatGenero {
  idGenero: number;
  nombre: string;
}

export interface CatProfesion {
  idProfesion: number;
  nombre: string;
}

export interface Departamento {
  idDepartamento: number;
  nombre: string;
}

export interface Municipio {
  idMunicipio: number;
  nombre: string;
  idDepartamento: number;
}

export interface CatEstadoCita {
  idEstadoCita: number;
  nombre: string;
}
