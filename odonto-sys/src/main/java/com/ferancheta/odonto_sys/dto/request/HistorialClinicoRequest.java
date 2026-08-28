package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HistorialClinicoRequest(
        @NotBlank(message = "La descripción es obligatoria")
        String descripcion,

        Integer idCita,

        @NotNull(message = "El paciente es obligatorio")
        Integer idPaciente,

        @NotNull(message = "El doctor es obligatorio")
        Integer idDoctor
) {
}
