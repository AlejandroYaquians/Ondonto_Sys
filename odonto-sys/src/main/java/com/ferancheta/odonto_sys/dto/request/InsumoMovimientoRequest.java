package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

public record InsumoMovimientoRequest(
        @NotNull(message = "La cantidad es obligatoria")
        Integer cantidad,

        String motivo,

        @NotNull(message = "El insumo es obligatorio")
        Integer idInsumo,

        @NotNull(message = "El tipo de movimiento es obligatorio")
        Integer idTipoMovimiento,

        Integer idGasto,

        @NotNull(message = "El usuario es obligatorio")
        Integer idUsuario
) {
}
