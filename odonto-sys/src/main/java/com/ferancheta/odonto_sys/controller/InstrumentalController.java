package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.InstrumentalRequest;
import com.ferancheta.odonto_sys.dto.response.InstrumentalResponse;
import com.ferancheta.odonto_sys.service.InstrumentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instrumental")
@RequiredArgsConstructor
public class InstrumentalController {

    private final InstrumentalService service;

    @GetMapping
    public List<InstrumentalResponse> listar(
            @RequestParam(required = false) Boolean activos,
            @RequestParam(required = false) Boolean stockBajo) {

        if (Boolean.TRUE.equals(stockBajo)) {
            return service.listarConStockBajo();
        }
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @GetMapping("/{id}")
    public InstrumentalResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InstrumentalResponse crear(@Valid @RequestBody InstrumentalRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public InstrumentalResponse actualizar(@PathVariable Integer id, @Valid @RequestBody InstrumentalRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
