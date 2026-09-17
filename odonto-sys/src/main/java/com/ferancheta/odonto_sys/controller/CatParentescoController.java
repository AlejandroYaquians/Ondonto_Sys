package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatParentescoRequest;
import com.ferancheta.odonto_sys.dto.response.CatParentescoResponse;
import com.ferancheta.odonto_sys.service.CatParentescoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/parentescos")
@RequiredArgsConstructor
public class CatParentescoController {

    private final CatParentescoService service;

    @GetMapping
    public List<CatParentescoResponse> listar(@RequestParam(required = false) Boolean activos) {
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatParentescoResponse crear(@Valid @RequestBody CatParentescoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatParentescoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatParentescoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
