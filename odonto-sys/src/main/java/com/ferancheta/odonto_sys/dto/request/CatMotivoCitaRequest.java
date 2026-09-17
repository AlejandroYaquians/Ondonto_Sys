package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatMotivoCitaRequest(
        @NotBlank(message = "El nombre del motivo es obligatorio")
        String nombre
) {
}
