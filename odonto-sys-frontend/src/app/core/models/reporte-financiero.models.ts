export interface ComisionDoctorItem {
  idDoctor: number;
  nombreDoctor: string;
  montoComision: number;
  porcentaje: number;
}

export interface ReporteFinanciero {
  ingresosBrutos: number;
  cobroEfectivo: number;
  cobroTarjeta: number;
  cobroTransferencia: number;
  comisionBancaria: number;
  costoLaboratorio: number;
  montoNeto: number;
  gastosFijos: number;
  gastosVariables: number;
  totalComisiones: number;
  gananciaNeta: number;
  cantidadCobrosPagados: number;
  cantidadCobrosAnulados: number;
  montoCobrosAnulados: number;
  comisionesPorDoctor: ComisionDoctorItem[];
}
