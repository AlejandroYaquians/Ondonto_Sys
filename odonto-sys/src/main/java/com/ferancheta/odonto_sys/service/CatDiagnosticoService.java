package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatDiagnosticoRequest;
import com.ferancheta.odonto_sys.dto.response.CatDiagnosticoResponse;
import com.ferancheta.odonto_sys.entity.CatDiagnostico;
import com.ferancheta.odonto_sys.mapper.CatDiagnosticoMapper;
import com.ferancheta.odonto_sys.repository.CatDiagnosticoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatDiagnosticoService {

    private final CatDiagnosticoRepository repository;
    private final CatDiagnosticoMapper mapper;

    @Transactional(readOnly = true)
    public List<CatDiagnosticoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatDiagnosticoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public CatDiagnosticoResponse crear(CatDiagnosticoRequest request) {
        CatDiagnostico entidad = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public CatDiagnosticoResponse actualizar(Integer id, CatDiagnosticoRequest request) {
        CatDiagnostico existente = obtenerEntidad(id);
        CatDiagnostico actualizada = mapper.toEntity(request);
        actualizada.setIdDiagnostico(existente.getIdDiagnostico());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private CatDiagnostico obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Diagnóstico no encontrado: " + id));
    }
}
