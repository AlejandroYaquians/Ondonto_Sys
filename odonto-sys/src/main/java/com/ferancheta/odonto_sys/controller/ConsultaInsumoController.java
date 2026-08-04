package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.ConsultaInsumoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaInsumoResponse;
import com.ferancheta.odonto_sys.service.ConsultaInsumoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consulta-insumos")
@RequiredArgsConstructor
public class ConsultaInsumoController {

    private final ConsultaInsumoService service;

    @GetMapping
    public List<ConsultaInsumoResponse> listarPorConsultaTratamiento(@RequestParam Integer idConsultaTratamiento) {
        return service.listarPorConsultaTratamiento(idConsultaTratamiento);
    }

    @GetMapping("/{id}")
    public ConsultaInsumoResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultaInsumoResponse crear(@Valid @RequestBody ConsultaInsumoRequest request) {
        return service.crear(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
