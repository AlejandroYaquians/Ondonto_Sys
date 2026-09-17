package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatMotivoCitaRequest;
import com.ferancheta.odonto_sys.dto.response.CatMotivoCitaResponse;
import com.ferancheta.odonto_sys.entity.CatMotivoCita;
import com.ferancheta.odonto_sys.mapper.CatMotivoCitaMapper;
import com.ferancheta.odonto_sys.repository.CatMotivoCitaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public List<CatMotivoCitaResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatMotivoCitaResponse crear(CatMotivoCitaRequest request) {
        CatMotivoCita entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatMotivoCitaResponse actualizar(Integer id, CatMotivoCitaRequest request) {
        CatMotivoCita existente = obtenerEntidad(id);
        CatMotivoCita actualizada = mapper.toEntity(request);
        actualizada.setIdMotivoCita(existente.getIdMotivoCita());
        actualizada.setActivo(existente.getActivo());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        CatMotivoCita entidad = obtenerEntidad(id);
        entidad.setActivo(false);
        repository.save(entidad);
    }

    private CatMotivoCita obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Motivo de cita no encontrado: " + id));
    }
}
