package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record CitaResponse(
        Integer idCita,
        LocalDate fecha,
        LocalTime hora,
        LocalTime horaFin,
        String motivo,
        Integer idPaciente,
        Integer idDoctor,
        Integer idEstadoCita,
        Integer idUsuario
) {
}
