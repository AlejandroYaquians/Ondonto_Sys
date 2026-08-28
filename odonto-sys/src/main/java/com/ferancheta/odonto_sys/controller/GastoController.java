package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.GastoRequest;
import com.ferancheta.odonto_sys.dto.response.GastoResponse;
import com.ferancheta.odonto_sys.service.GastoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/gastos")
@RequiredArgsConstructor
public class GastoController {

    private final GastoService service;

    @GetMapping
    public List<GastoResponse> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(required = false) Integer idTipoGasto) {

        if (desde != null && hasta != null) {
            return service.listarPorRangoFecha(desde, hasta, idTipoGasto);
        }
        return service.listar();
    }

    @GetMapping("/{id}")
    public GastoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GastoResponse crear(@Valid @RequestBody GastoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public GastoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody GastoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
