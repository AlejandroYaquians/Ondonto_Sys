package com.ferancheta.odonto_sys.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DoctorResponse(
        Integer idDoctor,
        String nombre,
        String apellido,
        String telefono,
        String email,
        BigDecimal porcentajeComision,
        Boolean activo,
        List<Integer> idsEspecialidad,
        Integer idUsuario
) {
}
