package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.ComisionRequest;
import com.ferancheta.odonto_sys.dto.response.ComisionResponse;
import com.ferancheta.odonto_sys.service.ComisionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/comisiones")
@RequiredArgsConstructor
public class ComisionController {

    private final ComisionService service;

    @GetMapping
    public List<ComisionResponse> listar(
            @RequestParam(required = false) Integer idCobro,
            @RequestParam(required = false) Integer idDoctor,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {

        if (idCobro != null) {
            return service.listarPorCobro(idCobro);
        }
        if (desde != null && hasta != null) {
            return service.listarPorRangoFecha(desde, hasta, idDoctor);
        }
        if (idDoctor != null && estado != null) {
            return service.listarPorDoctorYEstado(idDoctor, estado);
        }
        return Collections.emptyList();
    }

    @GetMapping("/{id}")
    public ComisionResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComisionResponse crear(@Valid @RequestBody ComisionRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public ComisionResponse actualizar(@PathVariable Integer id, @Valid @RequestBody ComisionRequest request) {
        return service.actualizar(id, request);
    }

    @PatchMapping("/{id}/estado")
    public ComisionResponse cambiarEstado(@PathVariable Integer id, @RequestParam String estado) {
        return service.cambiarEstado(id, estado);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
