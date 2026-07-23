package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatProfesionRequest;
import com.ferancheta.odonto_sys.dto.response.CatProfesionResponse;
import com.ferancheta.odonto_sys.entity.CatProfesion;
import com.ferancheta.odonto_sys.mapper.CatProfesionMapper;
import com.ferancheta.odonto_sys.repository.CatProfesionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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
    public CatProfesionResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public CatProfesionResponse crear(CatProfesionRequest request) {
        CatProfesion entidad = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public CatProfesionResponse actualizar(Integer id, CatProfesionRequest request) {
        CatProfesion existente = obtenerEntidad(id);
        CatProfesion actualizada = mapper.toEntity(request);
        actualizada.setIdProfesion(existente.getIdProfesion());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private CatProfesion obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profesión no encontrada: " + id));
    }
}
