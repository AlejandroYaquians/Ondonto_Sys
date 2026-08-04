package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PagoDetalleRequest(
        @NotNull(message = "El precio aplicado es obligatorio")
        BigDecimal precioAplicado,

        BigDecimal costoLaboratorio,

        @NotNull(message = "El pago es obligatorio")
        Integer idPago,

        @NotNull(message = "El servicio es obligatorio")
        Integer idServicio,

        @NotNull(message = "El método de pago es obligatorio")
        Integer idMetodoPago,

        @NotNull(message = "La consulta tratamiento es obligatoria")
        Integer idConsultaTratamiento
) {
}
