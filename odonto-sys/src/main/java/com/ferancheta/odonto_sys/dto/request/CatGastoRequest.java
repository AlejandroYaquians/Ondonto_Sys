package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatGastoRequest(
        @NotBlank(message = "El nombre de la categoría es obligatorio")
        String nombreCategoria,

        String tipo
) {
}
