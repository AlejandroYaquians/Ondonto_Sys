package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.HistorialClinicoCobroRequest;
import com.ferancheta.odonto_sys.dto.response.HistorialClinicoCobroResponse;
import com.ferancheta.odonto_sys.service.HistorialClinicoCobroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/historial-clinico-cobro")
@RequiredArgsConstructor
public class HistorialClinicoCobroController {

    private final HistorialClinicoCobroService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HistorialClinicoCobroResponse registrar(@Valid @RequestBody HistorialClinicoCobroRequest request) {
        return service.registrar(request);
    }
}
