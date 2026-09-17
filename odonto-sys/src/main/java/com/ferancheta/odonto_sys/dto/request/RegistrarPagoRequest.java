package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RegistrarPagoRequest(
        @NotNull(message = "La fecha de corte es obligatoria")
        LocalDate fechaCorte
) {
}
