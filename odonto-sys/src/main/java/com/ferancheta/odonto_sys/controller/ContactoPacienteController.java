package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.ContactoPacienteRequest;
import com.ferancheta.odonto_sys.dto.response.ContactoPacienteResponse;
import com.ferancheta.odonto_sys.service.ContactoPacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contactos-paciente")
@RequiredArgsConstructor
public class ContactoPacienteController {

    private final ContactoPacienteService service;

    @GetMapping
    public List<ContactoPacienteResponse> listarPorPaciente(@RequestParam Integer idPaciente) {
        return service.listarPorPaciente(idPaciente);
    }

    @GetMapping("/{id}")
    public ContactoPacienteResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactoPacienteResponse crear(@Valid @RequestBody ContactoPacienteRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public ContactoPacienteResponse actualizar(@PathVariable Integer id, @Valid @RequestBody ContactoPacienteRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
