package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.PermisoRequest;
import com.ferancheta.odonto_sys.dto.response.PermisoResponse;
import com.ferancheta.odonto_sys.entity.Permiso;
import com.ferancheta.odonto_sys.mapper.PermisoMapper;
import com.ferancheta.odonto_sys.repository.MenuRepository;
import com.ferancheta.odonto_sys.repository.PermisoRepository;
import com.ferancheta.odonto_sys.repository.RolRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermisoService {

    private final PermisoRepository repository;
    private final RolRepository rolRepository;
    private final MenuRepository menuRepository;
    private final PermisoMapper mapper;

    @Transactional(readOnly = true)
    public List<PermisoResponse> listarPorRol(Integer idRol) {
        return repository.findByRol_IdRol(idRol).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PermisoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public PermisoResponse crear(PermisoRequest request) {
        Permiso entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public PermisoResponse actualizar(Integer id, PermisoRequest request) {
        Permiso existente = obtenerEntidad(id);
        Permiso actualizado = mapper.toEntity(request);
        actualizado.setIdPermiso(existente.getIdPermiso());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(Permiso entidad, PermisoRequest request) {
        entidad.setRol(rolRepository.findById(request.idRol())
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado: " + request.idRol())));
        entidad.setMenu(menuRepository.findById(request.idMenu())
                .orElseThrow(() -> new EntityNotFoundException("Menú no encontrado: " + request.idMenu())));
    }

    private Permiso obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Permiso no encontrado: " + id));
    }
}
