package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.PagoDetalleRequest;
import com.ferancheta.odonto_sys.dto.response.PagoDetalleResponse;
import com.ferancheta.odonto_sys.service.PagoDetalleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pago-detalles")
@RequiredArgsConstructor
public class PagoDetalleController {

    private final PagoDetalleService service;

    @GetMapping
    public List<PagoDetalleResponse> listarPorPago(@RequestParam Integer idPago) {
        return service.listarPorPago(idPago);
    }

    @GetMapping("/{id}")
    public PagoDetalleResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PagoDetalleResponse crear(@Valid @RequestBody PagoDetalleRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public PagoDetalleResponse actualizar(@PathVariable Integer id, @Valid @RequestBody PagoDetalleRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
