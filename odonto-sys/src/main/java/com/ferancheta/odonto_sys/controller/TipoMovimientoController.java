package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.TipoMovimientoResponse;
import com.ferancheta.odonto_sys.service.TipoMovimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tipos-movimiento")
@RequiredArgsConstructor
public class TipoMovimientoController {

    private final TipoMovimientoService service;

    @GetMapping
    public List<TipoMovimientoResponse> listar() {
        return service.listar();
    }
}
