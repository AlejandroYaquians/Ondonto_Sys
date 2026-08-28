package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.BitacoraResponse;
import com.ferancheta.odonto_sys.service.BitacoraService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/bitacora")
@RequiredArgsConstructor
public class BitacoraController {

    private static final int TAMANO_PAGINA = 10;

    private final BitacoraService service;

    @GetMapping
    public PagedModel<BitacoraResponse> listar(
            @RequestParam(required = false) Integer idUsuario,
            @RequestParam(required = false) String tablaAfectada,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(defaultValue = "0") int page) {

        LocalDateTime desdeFecha = desde != null ? LocalDateTime.of(desde, LocalTime.MIN) : null;
        LocalDateTime hastaFecha = hasta != null ? LocalDateTime.of(hasta, LocalTime.MAX) : null;
        Pageable pageable = PageRequest.of(page, TAMANO_PAGINA);

        return new PagedModel<>(service.listar(idUsuario, tablaAfectada, desdeFecha, hastaFecha, pageable));
    }

    @GetMapping("/{id}")
    public BitacoraResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }
}
