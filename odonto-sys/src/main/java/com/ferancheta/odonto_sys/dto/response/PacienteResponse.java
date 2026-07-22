package com.ferancheta.odonto_sys.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PacienteResponse(
        Integer idPaciente,
        String nombre,
        String apellido,
        LocalDate fechaNacimiento,
        String telefono,
        String celular,
        String email,
        String direccion,
        String referidoPor,
        String medicoFamilia,
        Boolean activo,
        LocalDateTime fechaRegistro,
        Integer idGenero,
        Integer idProfesion,
        Integer idMunicipio,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
