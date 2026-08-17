export interface Pago {
  idPago: number;
  fecha: string;
  montoEfectivo: number | null;
  montoTarjeta: number | null;
  comisionTarjeta: number | null;
  costoLaboratorio: number | null;
  montoBruto: number | null;
  montoNeto: number | null;
  numeroComprobante: string;
  estado: string;
  idPaciente: number;
  idMetodoPago: number;
  idUsuario: number;
}

export interface PagoRequest {
  montoEfectivo: number | null;
  montoTarjeta: number | null;
  comisionTarjeta: number | null;
  costoLaboratorio: number | null;
  montoBruto: number | null;
  montoNeto: number | null;
  idPaciente: number;
  idMetodoPago: number;
  idUsuario: number;
}

export interface PagoDetalle {
  idDetallePago: number;
  precioAplicado: number;
  costoLaboratorio: number | null;
  comisionDoctorCalculada: number | null;
  idPago: number;
  idServicio: number;
  idMetodoPago: number;
  idConsultaTratamiento: number;
}

export interface PagoDetalleRequest {
  precioAplicado: number;
  costoLaboratorio: number | null;
  idPago: number;
  idServicio: number;
  idMetodoPago: number;
  idConsultaTratamiento: number;
}

export interface Comision {
  idComision: number;
  montoBase: number;
  porcentajeAplicado: number;
  montoComision: number;
  estado: string;
  fecha: string;
  idDoctor: number;
  idPago: number;
  idUsuarioCreacion: number | null;
}

export interface ComisionRequest {
  montoBase: number;
  porcentajeAplicado: number;
  montoComision: number;
  fecha: string;
  idDoctor: number;
  idPago: number;
  idUsuarioCreacion: number | null;
}
