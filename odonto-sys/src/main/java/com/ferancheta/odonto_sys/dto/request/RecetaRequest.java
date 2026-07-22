package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RecetaRequest(
        @NotBlank(message = "El medicamento es obligatorio")
        String medicamento,

        String dosis,
        String frecuencia,
        String duracion,
        String indicaciones,

        @NotNull(message = "La fecha es obligatoria")
        LocalDate fecha,

        @NotNull(message = "La consulta es obligatoria")
        Integer idConsulta
) {
}
