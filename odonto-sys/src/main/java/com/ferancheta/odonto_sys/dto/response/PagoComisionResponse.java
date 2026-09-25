package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PagoComisionResponse(
        LocalDateTime fechaPago,
        BigDecimal montoPagado,
        LocalDate periodoDesde,
        LocalDate periodoHasta,
        String nombreUsuarioPago,
        String numeroReferencia
) {
}
