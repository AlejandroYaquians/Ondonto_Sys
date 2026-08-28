package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record HistorialClinicoCobroRequest(
        Integer idCita,

        @NotNull(message = "El paciente es obligatorio")
        Integer idPaciente,

        @NotNull(message = "El doctor es obligatorio")
        Integer idDoctor,

        @NotBlank(message = "La descripción es obligatoria")
        String descripcion,

        String medicamento,
        String dosis,
        String frecuencia,
        String duracion,
        String indicaciones,

        @NotNull(message = "El servicio es obligatorio")
        Integer idServicio,

        BigDecimal costoLaboratorio,

        Integer idMetodoPago,

        BigDecimal montoEfectivo,

        BigDecimal montoTarjeta
) {
}
