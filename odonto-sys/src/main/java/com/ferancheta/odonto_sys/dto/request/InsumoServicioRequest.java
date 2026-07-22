package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

public record InsumoServicioRequest(
        Integer cantidadEstimada,

        @NotNull(message = "El insumo es obligatorio")
        Integer idInsumo,

        @NotNull(message = "El servicio es obligatorio")
        Integer idServicio
) {
}
