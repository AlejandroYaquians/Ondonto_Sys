package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GastoRequest(
        @NotBlank(message = "La descripción es obligatoria")
        String descripcion,

        @NotNull(message = "El monto es obligatorio")
        BigDecimal monto,

        @NotNull(message = "La fecha es obligatoria")
        LocalDate fecha,

        String comprobante,

        @NotNull(message = "El tipo de gasto es obligatorio")
        Integer idTipoGasto,

        @NotNull(message = "El usuario es obligatorio")
        Integer idUsuario
) {
}
