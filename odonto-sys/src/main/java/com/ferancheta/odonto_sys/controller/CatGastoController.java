package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatGastoRequest;
import com.ferancheta.odonto_sys.dto.response.CatGastoResponse;
import com.ferancheta.odonto_sys.service.CatGastoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/tipos-gasto")
@RequiredArgsConstructor
public class CatGastoController {

    private final CatGastoService service;

    @GetMapping
    public List<CatGastoResponse> listar(@RequestParam(required = false) Boolean activos) {
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @GetMapping("/{id}")
    public CatGastoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatGastoResponse crear(@Valid @RequestBody CatGastoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatGastoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatGastoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
