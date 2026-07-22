package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;

public record ServicioResponse(
        Integer idServicio,
        String nombre,
        String descripcion,
        BigDecimal costoBase,
        Boolean activo
) {
}
