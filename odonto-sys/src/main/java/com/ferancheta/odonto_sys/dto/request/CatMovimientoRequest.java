package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CatMovimientoRequest(
        @NotBlank(message = "El nombre del movimiento es obligatorio")
        String nombreMovimiento,

        @NotNull(message = "Debe indicar si el movimiento es entrada o salida")
        Boolean operacion
) {
}
