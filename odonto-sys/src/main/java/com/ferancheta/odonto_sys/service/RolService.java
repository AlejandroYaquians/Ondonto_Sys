package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.RolRequest;
import com.ferancheta.odonto_sys.dto.response.RolResponse;
import com.ferancheta.odonto_sys.entity.Rol;
import com.ferancheta.odonto_sys.mapper.RolMapper;
import com.ferancheta.odonto_sys.repository.RolRepository;
import jakarta.persistence.EntityNotFoundException;
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

    @Transactional(readOnly = true)
    public RolResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public RolResponse crear(RolRequest request) {
        Rol entidad = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public RolResponse actualizar(Integer id, RolRequest request) {
        Rol existente = obtenerEntidad(id);
        Rol actualizada = mapper.toEntity(request);
        actualizada.setIdRol(existente.getIdRol());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private Rol obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado: " + id));
    }
}
