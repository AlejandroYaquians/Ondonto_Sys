package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatTratamientoRequest;
import com.ferancheta.odonto_sys.dto.response.CatTratamientoResponse;
import com.ferancheta.odonto_sys.entity.CatTratamiento;
import com.ferancheta.odonto_sys.mapper.CatTratamientoMapper;
import com.ferancheta.odonto_sys.repository.CatTratamientoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatTratamientoService {

    private final CatTratamientoRepository repository;
    private final CatTratamientoMapper mapper;

    @Transactional(readOnly = true)
    public List<CatTratamientoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatTratamientoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public CatTratamientoResponse crear(CatTratamientoRequest request) {
        CatTratamiento entidad = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public CatTratamientoResponse actualizar(Integer id, CatTratamientoRequest request) {
        CatTratamiento existente = obtenerEntidad(id);
        CatTratamiento actualizada = mapper.toEntity(request);
        actualizada.setIdTratamiento(existente.getIdTratamiento());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private CatTratamiento obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tratamiento no encontrado: " + id));
    }
}
