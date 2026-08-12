package com.ferancheta.odonto_sys.dto.response;

import java.util.List;

public record ModuloConMenusResponse(
        Integer idModulo,
        String nombre,
        List<MenuResponse> menus
) {
}
