package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatParentescoRequest;
import com.ferancheta.odonto_sys.dto.response.CatParentescoResponse;
import com.ferancheta.odonto_sys.entity.CatParentesco;
import com.ferancheta.odonto_sys.mapper.CatParentescoMapper;
import com.ferancheta.odonto_sys.repository.CatParentescoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatParentescoService {

    private final CatParentescoRepository repository;
    private final CatParentescoMapper mapper;

    @Transactional(readOnly = true)
    public List<CatParentescoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatParentescoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatParentescoResponse crear(CatParentescoRequest request) {
        CatParentesco entidad = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatParentescoResponse actualizar(Integer id, CatParentescoRequest request) {
        CatParentesco existente = obtenerEntidad(id);
        CatParentesco actualizada = mapper.toEntity(request);
        actualizada.setIdParentesco(existente.getIdParentesco());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private CatParentesco obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Parentesco no encontrado: " + id));
    }
}
