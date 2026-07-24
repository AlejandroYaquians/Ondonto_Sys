package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatMovimientoRequest;
import com.ferancheta.odonto_sys.dto.response.CatMovimientoResponse;
import com.ferancheta.odonto_sys.service.CatMovimientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/tipos-movimiento")
@RequiredArgsConstructor
public class CatMovimientoController {

    private final CatMovimientoService service;

    @GetMapping
    public List<CatMovimientoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CatMovimientoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatMovimientoResponse crear(@Valid @RequestBody CatMovimientoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatMovimientoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatMovimientoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
