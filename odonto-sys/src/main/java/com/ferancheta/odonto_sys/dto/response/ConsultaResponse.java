package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDateTime;

public record ConsultaResponse(
        Integer idConsulta,
        LocalDateTime fecha,
        String motivoConsulta,
        Integer idPaciente,
        Integer idDoctor,
        Integer idCita
) {
}
