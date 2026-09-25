package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.ModuloResponse;
import com.ferancheta.odonto_sys.mapper.ModuloMapper;
import com.ferancheta.odonto_sys.repository.ModuloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuloService {

    private final ModuloRepository repository;
    private final ModuloMapper mapper;

    @Transactional(readOnly = true)
    public List<ModuloResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }
}
