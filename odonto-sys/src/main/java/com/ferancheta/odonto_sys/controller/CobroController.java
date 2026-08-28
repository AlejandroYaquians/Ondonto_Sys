package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CobroRequest;
import com.ferancheta.odonto_sys.dto.response.CobroResponse;
import com.ferancheta.odonto_sys.service.CobroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/cobros")
@RequiredArgsConstructor
public class CobroController {

    private final CobroService service;

    @GetMapping
    public List<CobroResponse> listar(
            @RequestParam(required = false) Integer idPaciente,
            @RequestParam(required = false) Integer idCita,
            @RequestParam(required = false) Integer idDoctor,
            @RequestParam(required = false) Integer idMetodoPago,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {

        if (idPaciente != null) {
            return service.listarPorPaciente(idPaciente);
        }
        if (idCita != null) {
            return service.listarPorCita(idCita);
        }
        return service.listar(desde, hasta, idDoctor, idMetodoPago);
    }

    @GetMapping("/{id}")
    public CobroResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CobroResponse crear(@Valid @RequestBody CobroRequest request) {
        return service.crear(request);
    }

    @PatchMapping("/{id}/estado")
    public CobroResponse cambiarEstado(@PathVariable Integer id, @RequestParam String estado) {
        return service.cambiarEstado(id, estado);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
