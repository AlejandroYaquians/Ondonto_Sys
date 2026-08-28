package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.CatMotivoCitaResponse;
import com.ferancheta.odonto_sys.entity.CatMotivoCita;
import com.ferancheta.odonto_sys.mapper.CatMotivoCitaMapper;
import com.ferancheta.odonto_sys.repository.CatMotivoCitaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatMotivoCitaService {

    private final CatMotivoCitaRepository repository;
    private final CatMotivoCitaMapper mapper;

    @Transactional(readOnly = true)
    public List<CatMotivoCitaResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatMotivoCitaResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    private CatMotivoCita obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Motivo de cita no encontrado: " + id));
    }
}
