package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record InsumoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        String descripcion,
        String unidadMedida,
        Integer stockActual,
        Integer stockMinimo
) {
}
