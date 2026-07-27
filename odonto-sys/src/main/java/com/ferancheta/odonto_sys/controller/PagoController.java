package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.PagoRequest;
import com.ferancheta.odonto_sys.dto.response.PagoResponse;
import com.ferancheta.odonto_sys.service.PagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService service;

    @GetMapping
    public List<PagoResponse> listar(@RequestParam(required = false) Integer idPaciente) {
        return idPaciente != null ? service.listarPorPaciente(idPaciente) : service.listar();
    }

    @GetMapping("/{id}")
    public PagoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PagoResponse crear(@Valid @RequestBody PagoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public PagoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody PagoRequest request) {
        return service.actualizar(id, request);
    }

    @PatchMapping("/{id}/estado")
    public PagoResponse cambiarEstado(@PathVariable Integer id, @RequestParam String estado) {
        return service.cambiarEstado(id, estado);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
