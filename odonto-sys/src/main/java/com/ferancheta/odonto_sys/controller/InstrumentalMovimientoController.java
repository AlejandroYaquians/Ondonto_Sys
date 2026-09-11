package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.InstrumentalMovimientoRequest;
import com.ferancheta.odonto_sys.dto.response.InstrumentalMovimientoResponse;
import com.ferancheta.odonto_sys.service.InstrumentalMovimientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instrumental-movimientos")
@RequiredArgsConstructor
public class InstrumentalMovimientoController {

    private final InstrumentalMovimientoService service;

    @GetMapping
    public List<InstrumentalMovimientoResponse> listarPorInstrumental(@RequestParam Integer idInstrumental) {
        return service.listarPorInstrumental(idInstrumental);
    }

    @GetMapping("/{id}")
    public InstrumentalMovimientoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InstrumentalMovimientoResponse crear(@Valid @RequestBody InstrumentalMovimientoRequest request) {
        return service.crear(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
