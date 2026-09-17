package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ComisionAcumuladaResponse(
        Integer idDoctor,
        String nombreDoctor,
        BigDecimal montoAcumulado,
        LocalDateTime ultimaFechaPago
) {
}
