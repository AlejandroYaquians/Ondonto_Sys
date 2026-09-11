package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.ModuloConMenusResponse;
import com.ferancheta.odonto_sys.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/navegacion")
@RequiredArgsConstructor
public class NavegacionController {

    private final MenuService service;

    @GetMapping
    public List<ModuloConMenusResponse> navegacion() {
        return service.listarNavegacion();
    }
}
