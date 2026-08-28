export interface Cobro {
  idCobro: number;
  fecha: string;
  codigoCobro: number;
  montoEfectivo: number | null;
  montoTarjeta: number | null;
  comisionTarjeta: number | null;
  costoLaboratorio: number | null;
  montoBruto: number | null;
  montoNeto: number | null;
  estado: string;
  idPaciente: number;
  idCita: number | null;
  idMetodoPago: number;
  idUsuario: number;
  idServicio: number | null;
  precioAplicado: number | null;
  idDoctor: number | null;
  comisionDoctor: number | null;
}

export interface CobroRequest {
  idPaciente: number;
  idDoctor: number;
  idCita: number | null;
  idServicio: number;
  precioAplicado: number;
  costoLaboratorio: number | null;
  idMetodoPago: number | null;
  montoEfectivo: number | null;
  montoTarjeta: number | null;
}

export interface Comision {
  idComision: number;
  montoBase: number;
  porcentajeAplicado: number;
  montoComision: number;
  estado: string;
  fecha: string;
  idDoctor: number;
  idCobro: number;
  idUsuarioCreacion: number | null;
}
