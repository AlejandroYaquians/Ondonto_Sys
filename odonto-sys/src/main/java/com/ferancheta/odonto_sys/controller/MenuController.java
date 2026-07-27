package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.MenuRequest;
import com.ferancheta.odonto_sys.dto.response.MenuResponse;
import com.ferancheta.odonto_sys.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService service;

    @GetMapping
    public List<MenuResponse> listar(@RequestParam(required = false) Integer idModulo) {
        return idModulo != null ? service.listarPorModulo(idModulo) : service.listarActivos();
    }

    @GetMapping("/{id}")
    public MenuResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MenuResponse crear(@Valid @RequestBody MenuRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public MenuResponse actualizar(@PathVariable Integer id, @Valid @RequestBody MenuRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
