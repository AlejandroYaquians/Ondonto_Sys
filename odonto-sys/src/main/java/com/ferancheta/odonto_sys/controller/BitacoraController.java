package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.BitacoraRequest;
import com.ferancheta.odonto_sys.dto.response.BitacoraResponse;
import com.ferancheta.odonto_sys.service.BitacoraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/bitacora")
@RequiredArgsConstructor
public class BitacoraController {

    private final BitacoraService service;

    @GetMapping
    public List<BitacoraResponse> listar(
            @RequestParam(required = false) String tablaAfectada,
            @RequestParam(required = false) Integer idRegistro,
            @RequestParam(required = false) Integer idUsuario) {

        if (tablaAfectada != null && idRegistro != null) {
            return service.listarPorRegistro(tablaAfectada, idRegistro);
        }
        if (idUsuario != null) {
            return service.listarPorUsuario(idUsuario);
        }
        return Collections.emptyList();
    }

    @GetMapping("/{id}")
    public BitacoraResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BitacoraResponse crear(@Valid @RequestBody BitacoraRequest request) {
        return service.crear(request);
    }
}
