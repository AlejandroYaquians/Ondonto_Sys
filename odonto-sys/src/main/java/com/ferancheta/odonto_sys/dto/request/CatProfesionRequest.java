package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatProfesionRequest(
        @NotBlank(message = "El nombre de la profesión es obligatorio")
        String nombre
) {
}
