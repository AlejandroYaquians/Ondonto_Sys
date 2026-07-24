package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.DoctorRequest;
import com.ferancheta.odonto_sys.dto.response.DoctorResponse;
import com.ferancheta.odonto_sys.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctores")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService service;

    @GetMapping
    public List<DoctorResponse> listar(@RequestParam(required = false) Boolean activos) {
        return Boolean.TRUE.equals(activos) ? service.listarActivos() : service.listar();
    }

    @GetMapping("/{id}")
    public DoctorResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DoctorResponse crear(@Valid @RequestBody DoctorRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public DoctorResponse actualizar(@PathVariable Integer id, @Valid @RequestBody DoctorRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
