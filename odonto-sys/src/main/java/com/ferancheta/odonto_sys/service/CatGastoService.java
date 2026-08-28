package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatGastoRequest;
import com.ferancheta.odonto_sys.dto.response.CatGastoResponse;
import com.ferancheta.odonto_sys.entity.CatGasto;
import com.ferancheta.odonto_sys.mapper.CatGastoMapper;
import com.ferancheta.odonto_sys.repository.CatGastoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatGastoService {

    private final CatGastoRepository repository;
    private final CatGastoMapper mapper;

    @Transactional(readOnly = true)
    public List<CatGastoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CatGastoResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatGastoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatGastoResponse crear(CatGastoRequest request) {
        CatGasto entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatGastoResponse actualizar(Integer id, CatGastoRequest request) {
        CatGasto existente = obtenerEntidad(id);
        CatGasto actualizada = mapper.toEntity(request);
        actualizada.setIdTipoGasto(existente.getIdTipoGasto());
        actualizada.setActivo(existente.getActivo());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        CatGasto entidad = obtenerEntidad(id);
        entidad.setActivo(false);
        repository.save(entidad);
    }

    private CatGasto obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de gasto no encontrado: " + id));
    }
}
