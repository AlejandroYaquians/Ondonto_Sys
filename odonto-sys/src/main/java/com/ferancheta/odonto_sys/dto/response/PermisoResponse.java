package com.ferancheta.odonto_sys.dto.response;

public record PermisoResponse(
        Integer idPermiso,
        Integer idRol,
        Integer idMenu,
        Boolean puedeVer,
        Boolean puedeCrear,
        Boolean puedeEditar,
        Boolean puedeEliminar
) {
}
