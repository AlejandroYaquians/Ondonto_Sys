package com.ferancheta.odonto_sys.dto.response;

public record CatAfeccionResponse(
        Integer idAfeccion,
        String nombreAfeccion,
        Boolean activo
) {
}
