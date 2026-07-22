package com.ferancheta.odonto_sys.dto.response;

public record InsumoServicioResponse(
        Integer idInsumoServicio,
        Integer cantidadEstimada,
        Integer idInsumo,
        Integer idServicio
) {
}
