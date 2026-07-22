package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

public record ConsultaInsumoRequest(
        @NotNull(message = "La cantidad usada es obligatoria")
        Integer cantidadUsada,

        @NotNull(message = "La consulta tratamiento es obligatoria")
        Integer idConsultaTratamiento,

        @NotNull(message = "El insumo es obligatorio")
        Integer idInsumo,

        @NotNull(message = "El usuario de creación es obligatorio")
        Integer idUsuarioCreacion
) {
}
