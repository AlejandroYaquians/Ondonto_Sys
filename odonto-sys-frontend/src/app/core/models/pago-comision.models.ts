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
}

export interface RegistrarPagoRequest {
  fechaCorte: string;
}
