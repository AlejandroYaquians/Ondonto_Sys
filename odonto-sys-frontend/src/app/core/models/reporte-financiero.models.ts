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
  comisionBancaria: number;
  costoLaboratorio: number;
  montoNeto: number;
  gastosFijos: number;
  gastosVariables: number;
  gananciaNeta: number;
  comisionesPorDoctor: ComisionDoctorItem[];
}
