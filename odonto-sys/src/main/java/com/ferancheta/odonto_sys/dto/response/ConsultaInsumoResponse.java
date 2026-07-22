package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDateTime;

public record ConsultaInsumoResponse(
        Integer idConsultaInsumo,
        Integer cantidadUsada,
        LocalDateTime fecha,
        Integer idConsultaTratamiento,
        Integer idInsumo,
        Integer idUsuarioCreacion
) {
}
