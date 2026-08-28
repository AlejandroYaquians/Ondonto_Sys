package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.RecetaRequest;
import com.ferancheta.odonto_sys.dto.response.RecetaResponse;
import com.ferancheta.odonto_sys.service.RecetaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recetas")
@RequiredArgsConstructor
public class RecetaController {

    private final RecetaService service;

    @GetMapping
    public List<RecetaResponse> listar(
            @RequestParam(required = false) Integer idHistorialClinico,
            @RequestParam(required = false) Integer idPaciente) {

        if (idHistorialClinico != null) {
            return service.listarPorHistorialClinico(idHistorialClinico);
        }
        return service.listarPorPaciente(idPaciente);
    }

    @GetMapping("/{id}")
    public RecetaResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecetaResponse crear(@Valid @RequestBody RecetaRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public RecetaResponse actualizar(@PathVariable Integer id, @Valid @RequestBody RecetaRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
