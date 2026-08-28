package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.CatEstadoCitaResponse;
import com.ferancheta.odonto_sys.entity.CatEstadoCita;
import com.ferancheta.odonto_sys.mapper.CatEstadoCitaMapper;
import com.ferancheta.odonto_sys.repository.CatEstadoCitaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatEstadoCitaService {

    private final CatEstadoCitaRepository repository;
    private final CatEstadoCitaMapper mapper;

    @Transactional(readOnly = true)
    public List<CatEstadoCitaResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatEstadoCitaResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    private CatEstadoCita obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estado de cita no encontrado: " + id));
    }
}
