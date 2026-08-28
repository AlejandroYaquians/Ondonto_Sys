package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDate;

public record AntecedenteMedicoResponse(
        Integer idAntecedente,
        String observacionDetalle,
        LocalDate fechaRegistro,
        Integer idPaciente,
        Integer idAfeccion
) {
}
