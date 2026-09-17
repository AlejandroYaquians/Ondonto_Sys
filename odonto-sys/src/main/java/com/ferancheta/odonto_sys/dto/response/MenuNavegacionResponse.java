package com.ferancheta.odonto_sys.dto.response;

public record MenuNavegacionResponse(
        Integer idMenu,
        String nombre,
        String ruta,
        Integer orden,
        Integer idModulo,
        Boolean puedeCrear,
        Boolean puedeEditar,
        Boolean puedeEliminar
) {
}
