package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatTratamientoRequest;
import com.ferancheta.odonto_sys.dto.response.CatTratamientoResponse;
import com.ferancheta.odonto_sys.service.CatTratamientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/tratamientos")
@RequiredArgsConstructor
public class CatTratamientoController {

    private final CatTratamientoService service;

    @GetMapping
    public List<CatTratamientoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CatTratamientoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatTratamientoResponse crear(@Valid @RequestBody CatTratamientoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatTratamientoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatTratamientoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
