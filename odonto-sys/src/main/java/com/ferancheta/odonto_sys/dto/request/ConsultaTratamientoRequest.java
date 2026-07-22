package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ConsultaTratamientoRequest(
        String descripcion,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        String estado,

        @NotNull(message = "La consulta es obligatoria")
        Integer idConsulta,

        @NotNull(message = "El tratamiento es obligatorio")
        Integer idTratamiento,

        Integer idServicio
) {
}
