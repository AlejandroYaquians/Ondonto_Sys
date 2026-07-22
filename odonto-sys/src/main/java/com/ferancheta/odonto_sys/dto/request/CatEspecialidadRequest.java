package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatEspecialidadRequest(
        @NotBlank(message = "El nombre de la especialidad es obligatorio")
        String nombre
) {
}
