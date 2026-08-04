package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.InsumoRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoResponse;
import com.ferancheta.odonto_sys.service.InsumoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/insumos")
@RequiredArgsConstructor
public class InsumoController {

    private final InsumoService service;

    @GetMapping
    public List<InsumoResponse> listar(
            @RequestParam(required = false) Boolean activos,
            @RequestParam(required = false) Boolean stockBajo) {

        if (Boolean.TRUE.equals(stockBajo)) {
            return service.listarConStockBajo();
        }
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @GetMapping("/{id}")
    public InsumoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InsumoResponse crear(@Valid @RequestBody InsumoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public InsumoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody InsumoRequest request) {
        return service.actualizar(id, request);
    }

    @PatchMapping("/{id}/stock-minimo")
    public InsumoResponse actualizarStockMinimo(@PathVariable Integer id, @RequestParam Integer stockMinimo) {
        return service.actualizarStockMinimo(id, stockMinimo);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
