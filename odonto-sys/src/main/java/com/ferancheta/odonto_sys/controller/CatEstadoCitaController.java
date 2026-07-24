package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatEstadoCitaRequest;
import com.ferancheta.odonto_sys.dto.response.CatEstadoCitaResponse;
import com.ferancheta.odonto_sys.service.CatEstadoCitaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/estados-cita")
@RequiredArgsConstructor
public class CatEstadoCitaController {

    private final CatEstadoCitaService service;

    @GetMapping
    public List<CatEstadoCitaResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CatEstadoCitaResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatEstadoCitaResponse crear(@Valid @RequestBody CatEstadoCitaRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatEstadoCitaResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatEstadoCitaRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
