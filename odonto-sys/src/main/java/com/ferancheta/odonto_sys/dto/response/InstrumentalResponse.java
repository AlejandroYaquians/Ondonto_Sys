package com.ferancheta.odonto_sys.dto.response;

public record InstrumentalResponse(
        Integer idInstrumental,
        String nombre,
        String descripcion,
        Integer stockActual,
        Integer stockMinimo,
        Boolean activo
) {
}
