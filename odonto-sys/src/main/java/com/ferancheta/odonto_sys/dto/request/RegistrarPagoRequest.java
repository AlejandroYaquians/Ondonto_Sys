package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegistrarPagoRequest(
        @NotNull(message = "La fecha de corte es obligatoria")
        LocalDate fechaCorte,

        @Size(max = 50, message = "El número de referencia no puede superar los 50 caracteres")
        String numeroReferencia
) {
}
