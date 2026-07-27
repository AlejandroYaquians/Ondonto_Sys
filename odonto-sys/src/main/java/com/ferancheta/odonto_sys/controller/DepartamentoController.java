package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.DepartamentoRequest;
import com.ferancheta.odonto_sys.dto.response.DepartamentoResponse;
import com.ferancheta.odonto_sys.service.DepartamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departamentos")
@RequiredArgsConstructor
public class DepartamentoController {

    private final DepartamentoService service;

    @GetMapping
    public List<DepartamentoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public DepartamentoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DepartamentoResponse crear(@Valid @RequestBody DepartamentoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public DepartamentoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody DepartamentoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
