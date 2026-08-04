package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatMovimientoRequest;
import com.ferancheta.odonto_sys.dto.response.CatMovimientoResponse;
import com.ferancheta.odonto_sys.entity.CatMovimiento;
import com.ferancheta.odonto_sys.mapper.CatMovimientoMapper;
import com.ferancheta.odonto_sys.repository.CatMovimientoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatMovimientoService {

    private final CatMovimientoRepository repository;
    private final CatMovimientoMapper mapper;

    @Transactional(readOnly = true)
    public List<CatMovimientoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatMovimientoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatMovimientoResponse crear(CatMovimientoRequest request) {
        CatMovimiento entidad = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatMovimientoResponse actualizar(Integer id, CatMovimientoRequest request) {
        CatMovimiento existente = obtenerEntidad(id);
        CatMovimiento actualizada = mapper.toEntity(request);
        actualizada.setIdTipoMovimiento(existente.getIdTipoMovimiento());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private CatMovimiento obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de movimiento no encontrado: " + id));
    }
}
