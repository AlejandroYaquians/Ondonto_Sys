package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record CitaResponse(
        Integer idCita,
        LocalDate fecha,
        LocalTime hora,
        String observaciones,
        Integer idMotivoCita,
        Integer idPaciente,
        Integer idDoctor,
        Integer idEstadoCita,
        Integer idUsuario,
        LocalDateTime createdAt
) {
}
