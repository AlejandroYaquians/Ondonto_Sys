package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.CatMovimientoResponse;
import com.ferancheta.odonto_sys.service.CatMovimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/catalogos/tipos-movimiento")
@RequiredArgsConstructor
public class CatMovimientoController {

    private final CatMovimientoService service;

    @GetMapping
    public List<CatMovimientoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CatMovimientoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }
}
