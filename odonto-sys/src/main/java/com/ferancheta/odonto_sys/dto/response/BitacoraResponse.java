package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDateTime;

public record BitacoraResponse(
        Integer idBitacora,
        String tablaAfectada,
        Integer idRegistro,
        String accion,
        String campoModificado,
        String valorAnterior,
        String valorNuevo,
        LocalDateTime fechaHora,
        String ipOrigen,
        Integer idUsuario
) {
}
