package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.CatMotivoCitaResponse;
import com.ferancheta.odonto_sys.service.CatMotivoCitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/catalogos/motivos-cita")
@RequiredArgsConstructor
public class CatMotivoCitaController {

    private final CatMotivoCitaService service;

    @GetMapping
    public List<CatMotivoCitaResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CatMotivoCitaResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }
}
