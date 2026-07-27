package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.InsumoServicioRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoServicioResponse;
import com.ferancheta.odonto_sys.service.InsumoServicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/insumo-servicios")
@RequiredArgsConstructor
public class InsumoServicioController {

    private final InsumoServicioService service;

    @GetMapping
    public List<InsumoServicioResponse> listar(
            @RequestParam(required = false) Integer idServicio,
            @RequestParam(required = false) Integer idInsumo) {

        if (idServicio != null) {
            return service.listarPorServicio(idServicio);
        }
        if (idInsumo != null) {
            return service.listarPorInsumo(idInsumo);
        }
        return Collections.emptyList();
    }

    @GetMapping("/{id}")
    public InsumoServicioResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InsumoServicioResponse crear(@Valid @RequestBody InsumoServicioRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public InsumoServicioResponse actualizar(@PathVariable Integer id, @Valid @RequestBody InsumoServicioRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
