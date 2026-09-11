package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MenuRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        String ruta,
        Integer orden,

        @NotNull(message = "El módulo es obligatorio")
        Integer idModulo
) {
}
