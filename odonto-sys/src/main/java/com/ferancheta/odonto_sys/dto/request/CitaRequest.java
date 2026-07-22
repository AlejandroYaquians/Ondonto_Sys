package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record CitaRequest(
        @NotNull(message = "La fecha es obligatoria")
        LocalDate fecha,

        @NotNull(message = "La hora es obligatoria")
        LocalTime hora,

        LocalTime horaFin,
        String motivo,

        @NotNull(message = "El paciente es obligatorio")
        Integer idPaciente,

        @NotNull(message = "El doctor es obligatorio")
        Integer idDoctor,

        @NotNull(message = "El estado de la cita es obligatorio")
        Integer idEstadoCita,

        @NotNull(message = "El usuario es obligatorio")
        Integer idUsuario
) {
}
