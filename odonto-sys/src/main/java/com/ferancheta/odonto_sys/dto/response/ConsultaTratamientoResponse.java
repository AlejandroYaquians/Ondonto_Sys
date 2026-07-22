package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDate;

public record ConsultaTratamientoResponse(
        Integer idConsultaTratamiento,
        String descripcion,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        String estado,
        Integer idConsulta,
        Integer idTratamiento,
        Integer idServicio
) {
}
