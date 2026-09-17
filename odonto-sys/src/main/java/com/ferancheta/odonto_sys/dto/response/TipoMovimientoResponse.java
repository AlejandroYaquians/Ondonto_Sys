package com.ferancheta.odonto_sys.dto.response;

public record TipoMovimientoResponse(
        Integer idTipoMovimiento,
        String nombreMovimiento,
        Boolean operacion
) {
}
