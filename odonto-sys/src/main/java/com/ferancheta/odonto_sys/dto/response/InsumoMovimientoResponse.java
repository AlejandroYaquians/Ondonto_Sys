package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDateTime;

public record InsumoMovimientoResponse(
        Integer idMovimiento,
        Integer cantidad,
        LocalDateTime fecha,
        String motivo,
        Integer idInsumo,
        Integer idTipoMovimiento,
        Integer idGasto,
        Integer idUsuario
) {
}
