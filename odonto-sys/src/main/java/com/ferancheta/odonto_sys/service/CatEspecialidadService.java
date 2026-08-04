package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatEspecialidadRequest;
import com.ferancheta.odonto_sys.dto.response.CatEspecialidadResponse;
import com.ferancheta.odonto_sys.entity.CatEspecialidad;
import com.ferancheta.odonto_sys.mapper.CatEspecialidadMapper;
import com.ferancheta.odonto_sys.repository.CatEspecialidadRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatEspecialidadService {

    private final CatEspecialidadRepository repository;
    private final CatEspecialidadMapper mapper;

    @Transactional(readOnly = true)
    public List<CatEspecialidadResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatEspecialidadResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatEspecialidadResponse crear(CatEspecialidadRequest request) {
        CatEspecialidad entidad = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatEspecialidadResponse actualizar(Integer id, CatEspecialidadRequest request) {
        CatEspecialidad existente = obtenerEntidad(id);
        CatEspecialidad actualizada = mapper.toEntity(request);
        actualizada.setIdEspecialidad(existente.getIdEspecialidad());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private CatEspecialidad obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Especialidad no encontrada: " + id));
    }
}
