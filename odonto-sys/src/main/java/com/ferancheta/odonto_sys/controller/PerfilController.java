package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CambiarPasswordRequest;
import com.ferancheta.odonto_sys.dto.response.PerfilResponse;
import com.ferancheta.odonto_sys.service.PerfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService service;

    @GetMapping
    public PerfilResponse obtenerPerfil() {
        return service.obtenerPerfil();
    }

    @PatchMapping("/password")
    public void cambiarPassword(@Valid @RequestBody CambiarPasswordRequest request) {
        service.cambiarPassword(request);
    }
}
