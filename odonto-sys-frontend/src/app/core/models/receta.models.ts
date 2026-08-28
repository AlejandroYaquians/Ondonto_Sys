export interface Receta {
  idReceta: number;
  medicamento: string;
  dosis: string | null;
  frecuencia: string | null;
  duracion: string | null;
  indicaciones: string | null;
  fecha: string;
  idHistorialClinico: number;
}

export interface RecetaRequest {
  medicamento: string;
  dosis: string | null;
  frecuencia: string | null;
  duracion: string | null;
  indicaciones: string | null;
  fecha: string;
  idHistorialClinico: number;
}
