package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatParentescoRequest(
        @NotBlank(message = "El nombre del parentesco es obligatorio")
        String nombre
) {
}
