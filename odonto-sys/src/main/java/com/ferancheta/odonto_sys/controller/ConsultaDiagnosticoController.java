package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.ConsultaDiagnosticoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaDiagnosticoResponse;
import com.ferancheta.odonto_sys.service.ConsultaDiagnosticoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consulta-diagnosticos")
@RequiredArgsConstructor
public class ConsultaDiagnosticoController {

    private final ConsultaDiagnosticoService service;

    @GetMapping
    public List<ConsultaDiagnosticoResponse> listarPorConsulta(@RequestParam Integer idConsulta) {
        return service.listarPorConsulta(idConsulta);
    }

    @GetMapping("/{id}")
    public ConsultaDiagnosticoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultaDiagnosticoResponse crear(@Valid @RequestBody ConsultaDiagnosticoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public ConsultaDiagnosticoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody ConsultaDiagnosticoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
