package com.ferancheta.odonto_sys.dto.request;

import jakarta.validation.constraints.NotNull;

public record PermisoRequest(
        @NotNull(message = "El rol es obligatorio")
        Integer idRol,

        @NotNull(message = "El menú es obligatorio")
        Integer idMenu,

        Boolean puedeVer,
        Boolean puedeCrear,
        Boolean puedeEditar,
        Boolean puedeEliminar
) {
}
