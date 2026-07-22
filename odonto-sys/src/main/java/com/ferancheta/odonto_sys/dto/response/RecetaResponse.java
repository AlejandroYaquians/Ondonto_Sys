package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDate;

public record RecetaResponse(
        Integer idReceta,
        String medicamento,
        String dosis,
        String frecuencia,
        String duracion,
        String indicaciones,
        LocalDate fecha,
        Integer idConsulta
) {
}
