package com.ferancheta.odonto_sys.dto.response;

public record CatGastoResponse(
        Integer idTipoGasto,
        String nombreCategoria,
        String tipo,
        Boolean activo
) {
}
