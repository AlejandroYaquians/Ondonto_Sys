package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.AntecedenteMedicoRequest;
import com.ferancheta.odonto_sys.dto.response.AntecedenteMedicoResponse;
import com.ferancheta.odonto_sys.service.AntecedenteMedicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/antecedentes-medicos")
@RequiredArgsConstructor
public class AntecedenteMedicoController {

    private final AntecedenteMedicoService service;

    @GetMapping
    public List<AntecedenteMedicoResponse> listarPorPaciente(@RequestParam Integer idPaciente) {
        return service.listarPorPaciente(idPaciente);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AntecedenteMedicoResponse crear(@Valid @RequestBody AntecedenteMedicoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public AntecedenteMedicoResponse actualizar(@PathVariable Integer id, @Valid @RequestBody AntecedenteMedicoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
