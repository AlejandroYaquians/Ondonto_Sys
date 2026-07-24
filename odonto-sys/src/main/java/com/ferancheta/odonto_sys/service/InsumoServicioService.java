package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.InsumoServicioRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoServicioResponse;
import com.ferancheta.odonto_sys.entity.InsumoServicio;
import com.ferancheta.odonto_sys.mapper.InsumoServicioMapper;
import com.ferancheta.odonto_sys.repository.InsumoRepository;
import com.ferancheta.odonto_sys.repository.InsumoServicioRepository;
import com.ferancheta.odonto_sys.repository.ServicioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InsumoServicioService {

    private final InsumoServicioRepository repository;
    private final InsumoRepository insumoRepository;
    private final ServicioRepository servicioRepository;
    private final InsumoServicioMapper mapper;

    @Transactional(readOnly = true)
    public List<InsumoServicioResponse> listarPorServicio(Integer idServicio) {
        return repository.findByServicio_IdServicio(idServicio).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<InsumoServicioResponse> listarPorInsumo(Integer idInsumo) {
        return repository.findByInsumo_IdInsumo(idInsumo).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InsumoServicioResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public InsumoServicioResponse crear(InsumoServicioRequest request) {
        InsumoServicio entidad = mapper.toEntity(request);
        if (entidad.getCantidadEstimada() == null) {
            entidad.setCantidadEstimada(1);
        }
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public InsumoServicioResponse actualizar(Integer id, InsumoServicioRequest request) {
        InsumoServicio existente = obtenerEntidad(id);
        InsumoServicio actualizado = mapper.toEntity(request);
        actualizado.setIdInsumoServicio(existente.getIdInsumoServicio());
        if (actualizado.getCantidadEstimada() == null) {
            actualizado.setCantidadEstimada(1);
        }
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(InsumoServicio entidad, InsumoServicioRequest request) {
        entidad.setInsumo(insumoRepository.findById(request.idInsumo())
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado: " + request.idInsumo())));
        entidad.setServicio(servicioRepository.findById(request.idServicio())
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado: " + request.idServicio())));
    }

    private InsumoServicio obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Insumo-servicio no encontrado: " + id));
    }
}
