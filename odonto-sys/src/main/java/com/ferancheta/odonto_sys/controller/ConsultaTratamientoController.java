package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.ConsultaTratamientoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaTratamientoResponse;
import com.ferancheta.odonto_sys.service.ConsultaTratamientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consulta-tratamientos")
@RequiredArgsConstructor
public class ConsultaTratamientoController {

    private final ConsultaTratamientoService service;

    @GetMapping
    public List<ConsultaTratamientoResponse> listarPorConsulta(@RequestParam Integer idConsulta) {
        return service.listarPorConsulta(idConsulta);
    }

    @GetMapping("/{id}")
    public ConsultaTratamientoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultaTratamientoResponse crear(@Valid @RequestBody ConsultaTratamientoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public ConsultaTratamientoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody ConsultaTratamientoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
