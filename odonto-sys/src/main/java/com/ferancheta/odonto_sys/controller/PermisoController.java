package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.PermisoRequest;
import com.ferancheta.odonto_sys.dto.response.PermisoResponse;
import com.ferancheta.odonto_sys.service.PermisoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permisos")
@RequiredArgsConstructor
public class PermisoController {

    private final PermisoService service;

    @GetMapping
    public List<PermisoResponse> listarPorRol(@RequestParam Integer idRol) {
        return service.listarPorRol(idRol);
    }

    @GetMapping("/{id}")
    public PermisoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PermisoResponse crear(@Valid @RequestBody PermisoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public PermisoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody PermisoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
