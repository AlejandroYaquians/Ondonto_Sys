package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.ConsultaRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaResponse;
import com.ferancheta.odonto_sys.service.ConsultaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService service;

    @GetMapping
    public List<ConsultaResponse> listar(
            @RequestParam(required = false) Integer idPaciente,
            @RequestParam(required = false) Integer idDoctor) {

        if (idPaciente != null) {
            return service.listarPorPaciente(idPaciente);
        }
        if (idDoctor != null) {
            return service.listarPorDoctor(idDoctor);
        }
        return service.listar();
    }

    @GetMapping("/{id}")
    public ConsultaResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultaResponse crear(@Valid @RequestBody ConsultaRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public ConsultaResponse actualizar(@PathVariable Integer id, @Valid @RequestBody ConsultaRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
