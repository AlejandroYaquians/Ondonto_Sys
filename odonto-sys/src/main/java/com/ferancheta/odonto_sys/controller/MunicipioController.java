package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.MunicipioRequest;
import com.ferancheta.odonto_sys.dto.response.MunicipioResponse;
import com.ferancheta.odonto_sys.service.MunicipioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/municipios")
@RequiredArgsConstructor
public class MunicipioController {

    private final MunicipioService service;

    @GetMapping
    public List<MunicipioResponse> listar(@RequestParam(required = false) Integer idDepartamento) {
        return idDepartamento != null ? service.listarPorDepartamento(idDepartamento) : service.listar();
    }

    @GetMapping("/{id}")
    public MunicipioResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MunicipioResponse crear(@Valid @RequestBody MunicipioRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public MunicipioResponse actualizar(@PathVariable Integer id, @Valid @RequestBody MunicipioRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
