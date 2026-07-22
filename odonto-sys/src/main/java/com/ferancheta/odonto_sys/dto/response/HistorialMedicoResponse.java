package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDate;

public record HistorialMedicoResponse(
        Integer idHistorial,
        String observacionDetalle,
        LocalDate fechaRegistro,
        Integer idPaciente,
        Integer idAfeccion
) {
}
