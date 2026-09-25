package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CobroResponse(
        Integer idCobro,
        LocalDateTime fecha,
        Long codigoCobro,
        BigDecimal montoEfectivo,
        BigDecimal montoTarjeta,
        BigDecimal montoTransferencia,
        BigDecimal comisionTarjeta,
        BigDecimal costoLaboratorio,
        BigDecimal montoBruto,
        BigDecimal montoNeto,
        String estado,
        Integer idPaciente,
        Integer idCita,
        Integer idMetodoPago,
        Integer idUsuario,
        Integer idServicio,
        BigDecimal precioAplicado,
        Integer idDoctor,
        BigDecimal comisionDoctor
) {
}
