package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CatDiagnosticoRequest(
        @NotBlank(message = "El nombre del diagnóstico es obligatorio")
        String nombre,

        String descripcion
) {
}
