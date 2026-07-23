package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatGastoRequest;
import com.ferancheta.odonto_sys.dto.response.CatGastoResponse;
import com.ferancheta.odonto_sys.entity.CatGasto;
import com.ferancheta.odonto_sys.mapper.CatGastoMapper;
import com.ferancheta.odonto_sys.repository.CatGastoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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
    public CatGastoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public CatGastoResponse crear(CatGastoRequest request) {
        CatGasto entidad = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public CatGastoResponse actualizar(Integer id, CatGastoRequest request) {
        CatGasto existente = obtenerEntidad(id);
        CatGasto actualizada = mapper.toEntity(request);
        actualizada.setIdTipoGasto(existente.getIdTipoGasto());
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private CatGasto obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de gasto no encontrado: " + id));
    }
}
