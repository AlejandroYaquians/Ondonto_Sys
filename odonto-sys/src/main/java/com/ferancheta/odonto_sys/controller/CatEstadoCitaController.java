package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.CatEstadoCitaResponse;
import com.ferancheta.odonto_sys.service.CatEstadoCitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/catalogos/estados-cita")
@RequiredArgsConstructor
public class CatEstadoCitaController {

    private final CatEstadoCitaService service;

    @GetMapping
    public List<CatEstadoCitaResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CatEstadoCitaResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }
}
