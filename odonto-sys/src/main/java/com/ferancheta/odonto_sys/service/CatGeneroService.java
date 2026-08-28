package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatGeneroRequest;
import com.ferancheta.odonto_sys.dto.response.CatGeneroResponse;
import com.ferancheta.odonto_sys.entity.CatGenero;
import com.ferancheta.odonto_sys.mapper.CatGeneroMapper;
import com.ferancheta.odonto_sys.repository.CatGeneroRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatGeneroService {

    private final CatGeneroRepository repository;
    private final CatGeneroMapper mapper;

    @Transactional(readOnly = true)
    public List<CatGeneroResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CatGeneroResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatGeneroResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatGeneroResponse crear(CatGeneroRequest request) {
        CatGenero entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatGeneroResponse actualizar(Integer id, CatGeneroRequest request) {
        CatGenero existente = obtenerEntidad(id);
        CatGenero actualizada = mapper.toEntity(request);
        actualizada.setIdGenero(existente.getIdGenero());
        actualizada.setActivo(existente.getActivo());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        CatGenero entidad = obtenerEntidad(id);
        entidad.setActivo(false);
        repository.save(entidad);
    }

    private CatGenero obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Género no encontrado: " + id));
    }
}
