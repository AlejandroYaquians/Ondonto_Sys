package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatEstadoCitaRequest(
        @NotBlank(message = "El nombre del estado de cita es obligatorio")
        String nombre
) {
}
