package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatProfesionRequest;
import com.ferancheta.odonto_sys.dto.response.CatProfesionResponse;
import com.ferancheta.odonto_sys.entity.CatProfesion;
import com.ferancheta.odonto_sys.mapper.CatProfesionMapper;
import com.ferancheta.odonto_sys.repository.CatProfesionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatProfesionService {

    private final CatProfesionRepository repository;
    private final CatProfesionMapper mapper;

    @Transactional(readOnly = true)
    public List<CatProfesionResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CatProfesionResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatProfesionResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatProfesionResponse crear(CatProfesionRequest request) {
        CatProfesion entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatProfesionResponse actualizar(Integer id, CatProfesionRequest request) {
        CatProfesion existente = obtenerEntidad(id);
        CatProfesion actualizada = mapper.toEntity(request);
        actualizada.setIdProfesion(existente.getIdProfesion());
        actualizada.setActivo(existente.getActivo());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        CatProfesion entidad = obtenerEntidad(id);
        entidad.setActivo(false);
        repository.save(entidad);
    }

    private CatProfesion obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profesión no encontrada: " + id));
    }
}
