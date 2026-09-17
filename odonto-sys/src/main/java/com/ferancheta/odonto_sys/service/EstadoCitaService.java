package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.EstadoCitaResponse;
import com.ferancheta.odonto_sys.mapper.EstadoCitaMapper;
import com.ferancheta.odonto_sys.repository.EstadoCitaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstadoCitaService {

    private final EstadoCitaRepository repository;
    private final EstadoCitaMapper mapper;

    @Transactional(readOnly = true)
    public List<EstadoCitaResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }
}
