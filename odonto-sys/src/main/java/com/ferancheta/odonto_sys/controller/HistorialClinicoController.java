package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.HistorialClinicoRequest;
import com.ferancheta.odonto_sys.dto.response.HistorialClinicoResponse;
import com.ferancheta.odonto_sys.service.HistorialClinicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/historial-clinico")
@RequiredArgsConstructor
public class HistorialClinicoController {

    private final HistorialClinicoService service;

    @GetMapping
    public List<HistorialClinicoResponse> listar(@RequestParam(required = false) Integer idPaciente) {
        return idPaciente != null ? service.listarPorPaciente(idPaciente) : service.listar();
    }

    @GetMapping("/{id}")
    public HistorialClinicoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HistorialClinicoResponse crear(@Valid @RequestBody HistorialClinicoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public HistorialClinicoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody HistorialClinicoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
