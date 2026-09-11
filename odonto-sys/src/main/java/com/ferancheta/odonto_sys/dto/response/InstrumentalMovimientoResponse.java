package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDateTime;

public record InstrumentalMovimientoResponse(
        Integer idInstrumentalMovimiento,
        Integer cantidad,
        LocalDateTime fecha,
        String motivo,
        Integer idInstrumental,
        Integer idTipoMovimiento,
        Integer idUsuario
) {
}
