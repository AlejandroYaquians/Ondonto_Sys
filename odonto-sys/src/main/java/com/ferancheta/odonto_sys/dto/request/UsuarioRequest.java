package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El username es obligatorio")
        String username,

        @NotBlank(message = "El password es obligatorio")
        String password,

        @NotNull(message = "El rol es obligatorio")
        Integer idRol,

        // Los siguientes tres campos solo se usan (y son obligatorios) cuando idRol es DOCTOR,
        // para crear automáticamente el registro correspondiente en la tabla doctor.
        String apellido,
        Integer idEspecialidad,
        BigDecimal porcentajeComision
) {
}
