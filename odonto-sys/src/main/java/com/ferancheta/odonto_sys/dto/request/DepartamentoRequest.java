package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

public record DepartamentoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre
) {
}
