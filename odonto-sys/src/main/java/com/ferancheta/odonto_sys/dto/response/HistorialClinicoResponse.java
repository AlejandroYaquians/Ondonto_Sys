package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDateTime;

public record HistorialClinicoResponse(
        Integer idHistorialClinico,
        LocalDateTime fecha,
        String descripcion,
        Integer idCita,
        Integer idPaciente,
        Integer idDoctor,
        Integer idUsuarioCreacion
) {
}
