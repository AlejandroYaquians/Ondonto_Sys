package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record GastoResponse(
        Integer idGasto,
        String descripcion,
        BigDecimal monto,
        LocalDate fecha,
        String comprobante,
        Integer idTipoGasto,
        Integer idUsuario,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
