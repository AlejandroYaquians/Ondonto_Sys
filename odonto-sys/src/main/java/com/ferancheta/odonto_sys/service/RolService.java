package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.RolResponse;
import com.ferancheta.odonto_sys.mapper.RolMapper;
import com.ferancheta.odonto_sys.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolService {

    private final RolRepository repository;
    private final RolMapper mapper;

    @Transactional(readOnly = true)
    public List<RolResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }
}
