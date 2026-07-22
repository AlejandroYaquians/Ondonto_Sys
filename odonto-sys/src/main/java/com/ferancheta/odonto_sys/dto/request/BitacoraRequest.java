package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BitacoraRequest(
        @NotBlank(message = "La tabla afectada es obligatoria")
        String tablaAfectada,

        @NotNull(message = "El id de registro es obligatorio")
        Integer idRegistro,

        @NotBlank(message = "La acción es obligatoria")
        String accion,

        String campoModificado,
        String valorAnterior,
        String valorNuevo,
        String ipOrigen,
        Integer idUsuario
) {
}
