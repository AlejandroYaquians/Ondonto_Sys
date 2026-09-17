package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.EstadoCitaResponse;
import com.ferancheta.odonto_sys.service.EstadoCitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/estados-cita")
@RequiredArgsConstructor
public class EstadoCitaController {

    private final EstadoCitaService service;

    @GetMapping
    public List<EstadoCitaResponse> listar() {
        return service.listar();
    }
}
