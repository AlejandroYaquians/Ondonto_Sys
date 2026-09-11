package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

public record InstrumentalMovimientoRequest(
        @NotNull(message = "La cantidad es obligatoria")
        Integer cantidad,

        String motivo,

        @NotNull(message = "El instrumental es obligatorio")
        Integer idInstrumental,

        @NotNull(message = "El tipo de movimiento es obligatorio")
        Integer idTipoMovimiento
) {
}
