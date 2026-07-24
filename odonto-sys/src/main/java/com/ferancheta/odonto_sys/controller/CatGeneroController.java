package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatGeneroRequest;
import com.ferancheta.odonto_sys.dto.response.CatGeneroResponse;
import com.ferancheta.odonto_sys.service.CatGeneroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/generos")
@RequiredArgsConstructor
public class CatGeneroController {

    private final CatGeneroService service;

    @GetMapping
    public List<CatGeneroResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CatGeneroResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatGeneroResponse crear(@Valid @RequestBody CatGeneroRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatGeneroResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatGeneroRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
