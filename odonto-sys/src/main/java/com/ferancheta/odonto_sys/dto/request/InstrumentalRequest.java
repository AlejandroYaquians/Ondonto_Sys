package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InstrumentalRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        String descripcion,

        @NotNull(message = "El stock actual es obligatorio")
        Integer stockActual,

        @NotNull(message = "El stock mínimo es obligatorio")
        Integer stockMinimo
) {
}
