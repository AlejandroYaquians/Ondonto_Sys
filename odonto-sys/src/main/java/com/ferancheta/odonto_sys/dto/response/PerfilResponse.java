package com.ferancheta.odonto_sys.dto.response;

public record PerfilResponse(
        Integer idUsuario,
        String nombre,
        String apellido,
        String username,
        Boolean estado,
        String nombreRol
) {
}
