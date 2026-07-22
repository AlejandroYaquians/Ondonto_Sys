package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDate;

public record ConsultaDiagnosticoResponse(
        Integer idConsultaDiagnostico,
        String descripcionDetalle,
        LocalDate fecha,
        Integer idConsulta,
        Integer idDiagnostico
) {
}
