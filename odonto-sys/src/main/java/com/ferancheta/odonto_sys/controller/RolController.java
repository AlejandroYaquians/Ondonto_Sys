package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.RolResponse;
import com.ferancheta.odonto_sys.service.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolService service;

    @GetMapping
    public List<RolResponse> listar() {
        return service.listar();
    }
}
