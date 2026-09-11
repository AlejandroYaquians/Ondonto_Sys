package com.ferancheta.odonto_sys.dto.response;

public record MenuResponse(
        Integer idMenu,
        String nombre,
        String ruta,
        Integer orden,
        Boolean activo,
        Integer idModulo
) {
}
