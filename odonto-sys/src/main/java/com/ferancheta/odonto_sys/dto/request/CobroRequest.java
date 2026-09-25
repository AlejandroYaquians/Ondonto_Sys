package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CobroRequest(
        @NotNull(message = "El paciente es obligatorio")
        Integer idPaciente,

        @NotNull(message = "El doctor es obligatorio")
        Integer idDoctor,

        Integer idCita,

        @NotNull(message = "El servicio es obligatorio")
        Integer idServicio,

        @NotNull(message = "El precio es obligatorio")
        BigDecimal precioAplicado,

        BigDecimal costoLaboratorio,

        Integer idMetodoPago,

        BigDecimal montoEfectivo,

        BigDecimal montoTarjeta,

        BigDecimal montoTransferencia
) {
}
