package com.ferancheta.odonto_sys.dto.response;

public record InsumoResponse(
        Integer idInsumo,
        String nombre,
        String descripcion,
        String unidadMedida,
        Integer stockActual,
        Integer stockMinimo,
        Boolean activo
) {
}
