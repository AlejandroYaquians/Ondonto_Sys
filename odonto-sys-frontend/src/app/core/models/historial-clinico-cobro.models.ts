export interface HistorialClinicoCobroRequest {
  idCita: number | null;
  idPaciente: number;
  idDoctor: number;
  descripcion: string;
  medicamento: string | null;
  dosis: string | null;
  frecuencia: string | null;
  duracion: string | null;
  indicaciones: string | null;
  idServicio: number;
  costoLaboratorio: number | null;
  idMetodoPago: number | null;
  montoEfectivo: number | null;
  montoTarjeta: number | null;
}

export interface HistorialClinicoCobroResponse {
  idHistorialClinico: number;
  idCobro: number;
  codigoCobro: number;
  montoBruto: number;
  comisionTarjeta: number;
  montoNeto: number;
  comisionDoctor: number;
}
