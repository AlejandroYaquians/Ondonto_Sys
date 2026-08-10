package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.InsumoMovimientoRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoMovimientoResponse;
import com.ferancheta.odonto_sys.service.InsumoMovimientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/insumo-movimientos")
@RequiredArgsConstructor
public class InsumoMovimientoController {

    private final InsumoMovimientoService service;

    @GetMapping
    public List<InsumoMovimientoResponse> listarPorInsumo(@RequestParam Integer idInsumo) {
        return service.listarPorInsumo(idInsumo);
    }

    @GetMapping("/{id}")
    public InsumoMovimientoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InsumoMovimientoResponse crear(@Valid @RequestBody InsumoMovimientoRequest request) {
        return service.crear(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
