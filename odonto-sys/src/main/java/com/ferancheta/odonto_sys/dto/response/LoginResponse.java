package com.ferancheta.odonto_sys.dto.response;

public record LoginResponse(
        String token,
        Integer idUsuario,
        String nombre,
        String apellido,
        String username,
        String rol
) {
}
