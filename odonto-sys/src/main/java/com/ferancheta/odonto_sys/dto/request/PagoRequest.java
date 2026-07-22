package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PagoRequest(
        BigDecimal montoEfectivo,
        BigDecimal montoTarjeta,
        BigDecimal comisionTarjeta,
        BigDecimal costoLaboratorio,
        BigDecimal montoBruto,
        BigDecimal montoNeto,

        @NotNull(message = "El paciente es obligatorio")
        Integer idPaciente,

        @NotNull(message = "El método de pago es obligatorio")
        Integer idMetodoPago,

        @NotNull(message = "El usuario es obligatorio")
        Integer idUsuario
) {
}
