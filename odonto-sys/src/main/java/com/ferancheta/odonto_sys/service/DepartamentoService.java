package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.DepartamentoRequest;
import com.ferancheta.odonto_sys.dto.response.DepartamentoResponse;
import com.ferancheta.odonto_sys.entity.Departamento;
import com.ferancheta.odonto_sys.mapper.DepartamentoMapper;
import com.ferancheta.odonto_sys.repository.DepartamentoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartamentoService {

    private final DepartamentoRepository repository;
    private final DepartamentoMapper mapper;

    @Transactional(readOnly = true)
    public List<DepartamentoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DepartamentoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public DepartamentoResponse crear(DepartamentoRequest request) {
        Departamento entidad = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public DepartamentoResponse actualizar(Integer id, DepartamentoRequest request) {
        Departamento existente = obtenerEntidad(id);
        Departamento actualizado = mapper.toEntity(request);
        actualizado.setIdDepartamento(existente.getIdDepartamento());
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private Departamento obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Departamento no encontrado: " + id));
    }
}
