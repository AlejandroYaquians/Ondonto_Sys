package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatAfeccionRequest(
        @NotBlank(message = "El nombre de la afección es obligatorio")
        String nombreAfeccion
) {
}
