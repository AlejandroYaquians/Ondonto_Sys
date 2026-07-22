package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PagoResponse(
        Integer idPago,
        LocalDateTime fecha,
        BigDecimal montoEfectivo,
        BigDecimal montoTarjeta,
        BigDecimal comisionTarjeta,
        BigDecimal costoLaboratorio,
        BigDecimal montoBruto,
        BigDecimal montoNeto,
        String numeroComprobante,
        String estado,
        Integer idPaciente,
        Integer idMetodoPago,
        Integer idUsuario
) {
}
