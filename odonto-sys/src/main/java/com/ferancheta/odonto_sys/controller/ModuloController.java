package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.ModuloResponse;
import com.ferancheta.odonto_sys.service.ModuloService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/modulos")
@RequiredArgsConstructor
public class ModuloController {

    private final ModuloService service;

    @GetMapping
    public List<ModuloResponse> listar(@RequestParam(required = false) Boolean activos) {
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }
}
