package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.PacienteRequest;
import com.ferancheta.odonto_sys.dto.response.PacienteResponse;
import com.ferancheta.odonto_sys.service.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService service;

    @GetMapping
    public List<PacienteResponse> listar(
            @RequestParam(required = false) Boolean activos,
            @RequestParam(required = false) String busqueda) {

        if (busqueda != null && !busqueda.isBlank()) {
            return service.buscarActivos(busqueda);
        }
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @GetMapping("/{id}")
    public PacienteResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PacienteResponse crear(@Valid @RequestBody PacienteRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public PacienteResponse actualizar(@PathVariable Integer id, @Valid @RequestBody PacienteRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
