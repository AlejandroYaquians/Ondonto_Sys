package com.ferancheta.odonto_sys.dto.response;

public record LoginResponse(
        String token,
        String username,
        String rol
) {
}
