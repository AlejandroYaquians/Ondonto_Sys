package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CatMetodoPagoRequest;
import com.ferancheta.odonto_sys.dto.response.CatMetodoPagoResponse;
import com.ferancheta.odonto_sys.service.CatMetodoPagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogos/metodos-pago")
@RequiredArgsConstructor
public class CatMetodoPagoController {

    private final CatMetodoPagoService service;

    @GetMapping
    public List<CatMetodoPagoResponse> listar(@RequestParam(required = false) Boolean activos) {
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @GetMapping("/{id}")
    public CatMetodoPagoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public CatMetodoPagoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CatMetodoPagoRequest request) {
        return service.actualizar(id, request);
    }
}
