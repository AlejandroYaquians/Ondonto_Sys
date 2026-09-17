package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.RegistrarPagoRequest;
import com.ferancheta.odonto_sys.dto.response.ComisionAcumuladaResponse;
import com.ferancheta.odonto_sys.dto.response.ComisionResponse;
import com.ferancheta.odonto_sys.dto.response.PagoComisionResponse;
import com.ferancheta.odonto_sys.service.PagoComisionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/financiero/pago-comisiones")
@RequiredArgsConstructor
public class PagoComisionController {

    private final PagoComisionService service;

    @GetMapping
    public List<ComisionAcumuladaResponse> listarAcumuladoPorDoctor() {
        return service.listarAcumuladoPorDoctor();
    }

    @GetMapping("/{idDoctor}/pendientes")
    public List<ComisionResponse> listarPendientes(@PathVariable Integer idDoctor) {
        return service.listarPendientes(idDoctor);
    }

    @GetMapping("/{idDoctor}/historial")
    public List<PagoComisionResponse> historialPagos(@PathVariable Integer idDoctor) {
        return service.historialPagos(idDoctor);
    }

    @PostMapping("/{idDoctor}/pagar")
    public ResponseEntity<Void> registrarPago(@PathVariable Integer idDoctor, @Valid @RequestBody RegistrarPagoRequest request) {
        service.registrarPago(idDoctor, request.fechaCorte());
        return ResponseEntity.noContent().build();
    }
}
