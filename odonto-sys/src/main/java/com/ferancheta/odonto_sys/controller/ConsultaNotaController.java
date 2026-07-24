package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.ConsultaNotaRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaNotaResponse;
import com.ferancheta.odonto_sys.service.ConsultaNotaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consulta-notas")
@RequiredArgsConstructor
public class ConsultaNotaController {

    private final ConsultaNotaService service;

    @GetMapping
    public List<ConsultaNotaResponse> listarPorConsulta(@RequestParam Integer idConsulta) {
        return service.listarPorConsulta(idConsulta);
    }

    @GetMapping("/{id}")
    public ConsultaNotaResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultaNotaResponse crear(@Valid @RequestBody ConsultaNotaRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public ConsultaNotaResponse actualizar(@PathVariable Integer id, @Valid @RequestBody ConsultaNotaRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
