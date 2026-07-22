package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ModuloRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        String descripcion
) {
}
