package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.MunicipioRequest;
import com.ferancheta.odonto_sys.dto.response.MunicipioResponse;
import com.ferancheta.odonto_sys.entity.Departamento;
import com.ferancheta.odonto_sys.entity.Municipio;
import com.ferancheta.odonto_sys.mapper.MunicipioMapper;
import com.ferancheta.odonto_sys.repository.DepartamentoRepository;
import com.ferancheta.odonto_sys.repository.MunicipioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MunicipioService {

    private final MunicipioRepository repository;
    private final DepartamentoRepository departamentoRepository;
    private final MunicipioMapper mapper;

    @Transactional(readOnly = true)
    public List<MunicipioResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<MunicipioResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<MunicipioResponse> listarPorDepartamento(Integer idDepartamento) {
        return repository.findByDepartamento_IdDepartamentoAndActivoTrue(idDepartamento)
                .stream().map(mapper::toResponse).toList();
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public MunicipioResponse crear(MunicipioRequest request) {
        Municipio entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        entidad.setDepartamento(obtenerDepartamento(request.idDepartamento()));
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public MunicipioResponse actualizar(Integer id, MunicipioRequest request) {
        Municipio existente = obtenerEntidad(id);
        Municipio actualizado = mapper.toEntity(request);
        actualizado.setIdMunicipio(existente.getIdMunicipio());
        actualizado.setActivo(existente.getActivo());
        actualizado.setDepartamento(obtenerDepartamento(request.idDepartamento()));
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        Municipio entidad = obtenerEntidad(id);
        entidad.setActivo(false);
        repository.save(entidad);
    }

    private Departamento obtenerDepartamento(Integer idDepartamento) {
        return departamentoRepository.findById(idDepartamento)
                .orElseThrow(() -> new EntityNotFoundException("Departamento no encontrado: " + idDepartamento));
    }

    private Municipio obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado: " + id));
    }
}
