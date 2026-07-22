package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record PacienteRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        String apellido,

        LocalDate fechaNacimiento,
        String telefono,
        String celular,
        String email,
        String direccion,
        String referidoPor,
        String medicoFamilia,
        Integer idGenero,
        Integer idProfesion,
        Integer idMunicipio
) {
}
