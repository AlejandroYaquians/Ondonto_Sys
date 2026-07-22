package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;

public record DoctorResponse(
        Integer idDoctor,
        String nombre,
        String apellido,
        String telefono,
        String email,
        BigDecimal porcentajeComision,
        Boolean activo,
        Integer idEspecialidad,
        Integer idUsuario
) {
}
