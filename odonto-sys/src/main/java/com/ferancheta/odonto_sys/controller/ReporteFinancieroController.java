package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.response.ReporteFinancieroResponse;
import com.ferancheta.odonto_sys.service.ReporteFinancieroService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/reportes/financiero")
@RequiredArgsConstructor
public class ReporteFinancieroController {

    private final ReporteFinancieroService service;

    @GetMapping
    public ReporteFinancieroResponse generar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return service.generar(desde, hasta);
    }

    @GetMapping("/csv")
    public ResponseEntity<byte[]> exportarCsv(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        byte[] csv = service.generarCsv(desde, hasta);
        String nombreArchivo = "cierre_caja_" + desde + "_" + hasta + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + nombreArchivo)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
