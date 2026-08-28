package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatEspecialidadRequest;
import com.ferancheta.odonto_sys.dto.response.CatEspecialidadResponse;
import com.ferancheta.odonto_sys.service.CatEspecialidadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/especialidades")
@RequiredArgsConstructor
public class CatEspecialidadController {

    private final CatEspecialidadService service;

    @GetMapping
    public List<CatEspecialidadResponse> listar(@RequestParam(required = false) Boolean activos) {
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @GetMapping("/{id}")
    public CatEspecialidadResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatEspecialidadResponse crear(@Valid @RequestBody CatEspecialidadRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatEspecialidadResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatEspecialidadRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
