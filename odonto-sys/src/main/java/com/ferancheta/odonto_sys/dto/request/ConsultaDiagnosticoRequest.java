package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ConsultaDiagnosticoRequest(
        String descripcionDetalle,

        @NotNull(message = "La fecha es obligatoria")
        LocalDate fecha,

        @NotNull(message = "La consulta es obligatoria")
        Integer idConsulta,

        @NotNull(message = "El diagnóstico es obligatorio")
        Integer idDiagnostico
) {
}
