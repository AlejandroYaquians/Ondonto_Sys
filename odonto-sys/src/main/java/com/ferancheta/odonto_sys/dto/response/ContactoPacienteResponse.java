package com.ferancheta.odonto_sys.dto.response;

public record ContactoPacienteResponse(
        Integer idContacto,
        String nombreCompleto,
        String telefonoContacto,
        Integer idPaciente,
        Integer idParentesco
) {
}
