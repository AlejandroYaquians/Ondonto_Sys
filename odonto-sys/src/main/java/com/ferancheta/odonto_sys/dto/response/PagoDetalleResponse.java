package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;

public record PagoDetalleResponse(
        Integer idDetallePago,
        BigDecimal precioAplicado,
        BigDecimal costoLaboratorio,
        BigDecimal comisionDoctorCalculada,
        Integer idPago,
        Integer idServicio,
        Integer idMetodoPago,
        Integer idConsultaTratamiento
) {
}
