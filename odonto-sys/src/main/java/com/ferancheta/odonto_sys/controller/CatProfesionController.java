package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatProfesionRequest;
import com.ferancheta.odonto_sys.dto.response.CatProfesionResponse;
import com.ferancheta.odonto_sys.service.CatProfesionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/profesiones")
@RequiredArgsConstructor
public class CatProfesionController {

    private final CatProfesionService service;

    @GetMapping
    public List<CatProfesionResponse> listar(@RequestParam(required = false) Boolean activos) {
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatProfesionResponse crear(@Valid @RequestBody CatProfesionRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatProfesionResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatProfesionRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
