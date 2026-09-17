package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatAfeccionRequest;
import com.ferancheta.odonto_sys.dto.response.CatAfeccionResponse;
import com.ferancheta.odonto_sys.entity.CatAfeccion;
import com.ferancheta.odonto_sys.mapper.CatAfeccionMapper;
import com.ferancheta.odonto_sys.repository.CatAfeccionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatAfeccionService {

    private final CatAfeccionRepository repository;
    private final CatAfeccionMapper mapper;

    @Transactional(readOnly = true)
    public List<CatAfeccionResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CatAfeccionResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatAfeccionResponse crear(CatAfeccionRequest request) {
        CatAfeccion entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatAfeccionResponse actualizar(Integer id, CatAfeccionRequest request) {
        CatAfeccion existente = obtenerEntidad(id);
        CatAfeccion actualizada = mapper.toEntity(request);
        actualizada.setIdAfeccion(existente.getIdAfeccion());
        actualizada.setActivo(existente.getActivo());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        CatAfeccion entidad = obtenerEntidad(id);
        entidad.setActivo(false);
        repository.save(entidad);
    }

    private CatAfeccion obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Afección no encontrada: " + id));
    }
}
