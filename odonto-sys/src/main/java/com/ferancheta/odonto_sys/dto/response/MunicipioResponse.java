package com.ferancheta.odonto_sys.dto.response;

public record MunicipioResponse(
        Integer idMunicipio,
        String nombre,
        Integer idDepartamento,
        Boolean activo
) {
}
