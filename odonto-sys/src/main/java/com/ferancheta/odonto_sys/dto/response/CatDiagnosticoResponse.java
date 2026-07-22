package com.ferancheta.odonto_sys.dto.response;

public record CatDiagnosticoResponse(
        Integer idDiagnostico,
        String nombre,
        String descripcion
) {
}
