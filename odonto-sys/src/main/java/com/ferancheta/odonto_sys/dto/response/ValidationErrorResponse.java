package com.ferancheta.odonto_sys.dto.response;

import java.util.Map;

public record ValidationErrorResponse(String mensaje, Map<String, String> errores) {
}
