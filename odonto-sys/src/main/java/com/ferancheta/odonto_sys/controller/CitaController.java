package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.CitaRequest;
import com.ferancheta.odonto_sys.dto.response.CitaResponse;
import com.ferancheta.odonto_sys.service.CitaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService service;

    @GetMapping
    public List<CitaResponse> listar(
            @RequestParam(required = false) Integer idDoctor,
            @RequestParam(required = false) Integer idPaciente,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        if (idDoctor != null && fecha != null) {
            return service.listarPorDoctorYFecha(idDoctor, fecha);
        }
        if (idPaciente != null) {
            return service.listarPorPaciente(idPaciente);
        }
        return service.listar();
    }

    @GetMapping("/{id}")
    public CitaResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CitaResponse crear(@Valid @RequestBody CitaRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public CitaResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CitaRequest request) {
        return service.actualizar(id, request);
    }

    @PatchMapping("/{id}/estado")
    public CitaResponse cambiarEstado(@PathVariable Integer id, @RequestParam String estado) {
        return service.cambiarEstado(id, estado);
    }

    @PatchMapping("/{id}/doctor")
    public CitaResponse cambiarDoctor(@PathVariable Integer id, @RequestParam Integer idDoctor) {
        return service.cambiarDoctor(id, idDoctor);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
