package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;

public record CatMetodoPagoResponse(
        Integer idMetodoPago,
        String nombre,
        BigDecimal comisionPorcentaje,
        Boolean activo
) {
}
