package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatAfeccionRequest;
import com.ferancheta.odonto_sys.dto.response.CatAfeccionResponse;
import com.ferancheta.odonto_sys.service.CatAfeccionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/afecciones")
@RequiredArgsConstructor
public class CatAfeccionController {

    private final CatAfeccionService service;

    @GetMapping
    public List<CatAfeccionResponse> listar(@RequestParam(required = false) Boolean activos) {
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatAfeccionResponse crear(@Valid @RequestBody CatAfeccionRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatAfeccionResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatAfeccionRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
