package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ContactoPacienteRequest(
        @NotBlank(message = "El nombre completo es obligatorio")
        String nombreCompleto,

        String telefonoContacto,

        @NotNull(message = "El paciente es obligatorio")
        Integer idPaciente,

        Integer idParentesco
) {
}
