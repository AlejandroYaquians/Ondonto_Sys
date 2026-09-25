export interface ComisionAcumulada {
  idDoctor: number;
  nombreDoctor: string;
  montoAcumulado: number;
  ultimaFechaPago: string | null;
}

export interface PagoComision {
  fechaPago: string;
  montoPagado: number;
  periodoDesde: string;
  periodoHasta: string;
  nombreUsuarioPago: string;
  numeroReferencia: string | null;
}

export interface RegistrarPagoRequest {
  fechaCorte: string;
  numeroReferencia: string | null;
}
