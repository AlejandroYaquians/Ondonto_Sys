package com.ferancheta.odonto_sys.dto.response;

public record CatEspecialidadResponse(
        Integer idEspecialidad,
        String nombre,
        Boolean activo
) {
}
