package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ConsultaNotaRequest(
        @NotBlank(message = "La nota es obligatoria")
        String nota,

        @NotNull(message = "La consulta es obligatoria")
        Integer idConsulta,

        @NotNull(message = "El doctor es obligatorio")
        Integer idDoctor,

        @NotNull(message = "El usuario de creación es obligatorio")
        Integer idUsuarioCreacion
) {
}
