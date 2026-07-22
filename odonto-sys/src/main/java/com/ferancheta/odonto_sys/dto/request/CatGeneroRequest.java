package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatGeneroRequest(
        @NotBlank(message = "El nombre del género es obligatorio")
        String nombre
) {
}
