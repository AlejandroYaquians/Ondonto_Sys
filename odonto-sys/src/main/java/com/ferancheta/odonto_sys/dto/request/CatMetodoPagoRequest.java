package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record CatMetodoPagoRequest(
        @NotBlank(message = "El nombre del método de pago es obligatorio")
        String nombre,

        BigDecimal comisionPorcentaje
) {
}
