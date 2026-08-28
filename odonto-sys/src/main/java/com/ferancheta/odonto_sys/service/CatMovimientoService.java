package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.CatMovimientoResponse;
import com.ferancheta.odonto_sys.entity.CatMovimiento;
import com.ferancheta.odonto_sys.mapper.CatMovimientoMapper;
import com.ferancheta.odonto_sys.repository.CatMovimientoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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

    private CatMovimiento obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de movimiento no encontrado: " + id));
    }
}
