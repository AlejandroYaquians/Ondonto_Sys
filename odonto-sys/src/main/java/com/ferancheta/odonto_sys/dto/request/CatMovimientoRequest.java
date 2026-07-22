package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatMovimientoRequest(
        @NotBlank(message = "El nombre del movimiento es obligatorio")
        String nombreMovimiento
) {
}
