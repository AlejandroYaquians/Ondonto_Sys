package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDateTime;

public record ConsultaNotaResponse(
        Integer idNota,
        String nota,
        LocalDateTime fecha,
        Integer idConsulta,
        Integer idDoctor,
        Integer idUsuarioCreacion
) {
}
