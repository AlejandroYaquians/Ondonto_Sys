package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DoctorRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        String apellido,

        String telefono,
        String email,

        @NotNull(message = "El porcentaje de comisión es obligatorio")
        BigDecimal porcentajeComision,

        Integer idEspecialidad,
        Integer idUsuario
) {
}
