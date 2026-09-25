package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record ReporteFinancieroResponse(
        BigDecimal ingresosBrutos,
        BigDecimal cobroEfectivo,
        BigDecimal cobroTarjeta,
        BigDecimal cobroTransferencia,
        BigDecimal comisionBancaria,
        BigDecimal costoLaboratorio,
        BigDecimal montoNeto,
        BigDecimal gastosFijos,
        BigDecimal gastosVariables,
        BigDecimal totalComisiones,
        BigDecimal gananciaNeta,
        Integer cantidadCobrosPagados,
        Integer cantidadCobrosAnulados,
        BigDecimal montoCobrosAnulados,
        List<ComisionDoctorItem> comisionesPorDoctor
) {

    public record ComisionDoctorItem(
            Integer idDoctor,
            String nombreDoctor,
            BigDecimal montoComision,
            BigDecimal porcentaje
    ) {
    }
}
