package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AntecedenteMedicoRequest(
        String observacionDetalle,

        @NotNull(message = "La fecha de registro es obligatoria")
        LocalDate fechaRegistro,

        @NotNull(message = "El paciente es obligatorio")
        Integer idPaciente,

        @NotNull(message = "La afección es obligatoria")
        Integer idAfeccion
) {
}
