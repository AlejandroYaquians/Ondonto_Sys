package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.HistorialMedicoRequest;
import com.ferancheta.odonto_sys.dto.response.HistorialMedicoResponse;
import com.ferancheta.odonto_sys.service.HistorialMedicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/historial-medico")
@RequiredArgsConstructor
public class HistorialMedicoController {

    private final HistorialMedicoService service;

    @GetMapping
    public List<HistorialMedicoResponse> listarPorPaciente(@RequestParam Integer idPaciente) {
        return service.listarPorPaciente(idPaciente);
    }

    @GetMapping("/{id}")
    public HistorialMedicoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HistorialMedicoResponse crear(@Valid @RequestBody HistorialMedicoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public HistorialMedicoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody HistorialMedicoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
