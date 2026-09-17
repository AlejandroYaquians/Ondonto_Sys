package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.TipoMovimientoResponse;
import com.ferancheta.odonto_sys.mapper.TipoMovimientoMapper;
import com.ferancheta.odonto_sys.repository.TipoMovimientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoMovimientoService {

    private final TipoMovimientoRepository repository;
    private final TipoMovimientoMapper mapper;

    @Transactional(readOnly = true)
    public List<TipoMovimientoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }
}
