package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatTratamientoRequest(
        @NotBlank(message = "El nombre del tratamiento es obligatorio")
        String nombre,

        String descripcion
) {
}
