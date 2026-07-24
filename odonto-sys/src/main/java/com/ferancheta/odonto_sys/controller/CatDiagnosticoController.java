package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatDiagnosticoRequest;
import com.ferancheta.odonto_sys.dto.response.CatDiagnosticoResponse;
import com.ferancheta.odonto_sys.service.CatDiagnosticoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/diagnosticos")
@RequiredArgsConstructor
public class CatDiagnosticoController {

    private final CatDiagnosticoService service;

    @GetMapping
    public List<CatDiagnosticoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CatDiagnosticoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatDiagnosticoResponse crear(@Valid @RequestBody CatDiagnosticoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatDiagnosticoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatDiagnosticoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
