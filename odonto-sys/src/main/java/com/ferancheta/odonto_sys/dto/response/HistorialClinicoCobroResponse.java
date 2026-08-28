package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;

public record HistorialClinicoCobroResponse(
        Integer idHistorialClinico,
        Integer idCobro,
        Long codigoCobro,
        BigDecimal montoBruto,
        BigDecimal comisionTarjeta,
        BigDecimal montoNeto,
        BigDecimal comisionDoctor
) {
}
