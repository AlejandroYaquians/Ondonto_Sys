package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatMotivoCitaRequest;
import com.ferancheta.odonto_sys.dto.response.CatMotivoCitaResponse;
import com.ferancheta.odonto_sys.service.CatMotivoCitaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/motivos-cita")
@RequiredArgsConstructor
public class CatMotivoCitaController {

    private final CatMotivoCitaService service;

    @GetMapping
    public List<CatMotivoCitaResponse> listar(@RequestParam(required = false) Boolean activos) {
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CatMotivoCitaResponse crear(@Valid @RequestBody CatMotivoCitaRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CatMotivoCitaResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatMotivoCitaRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
