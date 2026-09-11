package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Integer idUsuario,
        String nombre,
        String apellido,
        String username,
        Boolean estado,
        Integer idRol,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
