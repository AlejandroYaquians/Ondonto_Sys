package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ServicioRequest;
import com.ferancheta.odonto_sys.dto.response.ServicioResponse;
import com.ferancheta.odonto_sys.entity.Servicio;
import com.ferancheta.odonto_sys.mapper.ServicioMapper;
import com.ferancheta.odonto_sys.repository.ServicioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicioService {

    private final ServicioRepository repository;
    private final ServicioMapper mapper;

    @Transactional(readOnly = true)
    public List<ServicioResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ServicioResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ServicioResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public ServicioResponse crear(ServicioRequest request) {
        Servicio entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public ServicioResponse actualizar(Integer id, ServicioRequest request) {
        Servicio existente = obtenerEntidad(id);
        Servicio actualizado = mapper.toEntity(request);
        actualizado.setIdServicio(existente.getIdServicio());
        actualizado.setActivo(existente.getActivo());
        return mapper.toResponse(repository.save(actualizado));
    }

    /**
     * Se desactiva en vez de borrar porque queda referenciado desde consulta_tratamiento e insumo_servicio.
     */
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        Servicio servicio = obtenerEntidad(id);
        servicio.setActivo(false);
        repository.save(servicio);
    }

    private Servicio obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado: " + id));
    }
}
