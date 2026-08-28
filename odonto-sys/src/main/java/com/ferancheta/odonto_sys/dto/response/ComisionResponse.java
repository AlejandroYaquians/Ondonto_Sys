package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ComisionResponse(
        Integer idComision,
        BigDecimal montoBase,
        BigDecimal porcentajeAplicado,
        BigDecimal montoComision,
        String estado,
        LocalDate fecha,
        Integer idDoctor,
        Integer idCobro,
        Integer idUsuarioCreacion,
        LocalDateTime createdAt
) {
}
