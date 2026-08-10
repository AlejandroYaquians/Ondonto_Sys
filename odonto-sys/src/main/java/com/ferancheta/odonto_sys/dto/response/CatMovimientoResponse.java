package com.ferancheta.odonto_sys.dto.response;

public record CatMovimientoResponse(
        Integer idTipoMovimiento,
        String nombreMovimiento,
        Boolean operacion
) {
}
