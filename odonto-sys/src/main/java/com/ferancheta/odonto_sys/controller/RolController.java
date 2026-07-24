package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.RolRequest;
import com.ferancheta.odonto_sys.dto.response.RolResponse;
import com.ferancheta.odonto_sys.service.RolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolService service;

    @GetMapping
    public List<RolResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public RolResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RolResponse crear(@Valid @RequestBody RolRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public RolResponse actualizar(@PathVariable Integer id, @Valid @RequestBody RolRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
