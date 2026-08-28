package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ComisionRequest(
        @NotNull(message = "El monto base es obligatorio")
        BigDecimal montoBase,

        @NotNull(message = "El porcentaje aplicado es obligatorio")
        BigDecimal porcentajeAplicado,

        @NotNull(message = "El monto de comisión es obligatorio")
        BigDecimal montoComision,

        @NotNull(message = "La fecha es obligatoria")
        LocalDate fecha,

        @NotNull(message = "El doctor es obligatorio")
        Integer idDoctor,

        @NotNull(message = "El cobro es obligatorio")
        Integer idCobro,

        Integer idUsuarioCreacion
) {
}
