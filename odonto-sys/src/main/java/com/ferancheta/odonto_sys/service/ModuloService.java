package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ModuloRequest;
import com.ferancheta.odonto_sys.dto.response.ModuloResponse;
import com.ferancheta.odonto_sys.entity.Modulo;
import com.ferancheta.odonto_sys.mapper.ModuloMapper;
import com.ferancheta.odonto_sys.repository.ModuloRepository;
import jakarta.persistence.EntityNotFoundException;
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

    @Transactional(readOnly = true)
    public List<ModuloResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ModuloResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ModuloResponse crear(ModuloRequest request) {
        Modulo entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public ModuloResponse actualizar(Integer id, ModuloRequest request) {
        Modulo existente = obtenerEntidad(id);
        Modulo actualizado = mapper.toEntity(request);
        actualizado.setIdModulo(existente.getIdModulo());
        actualizado.setActivo(existente.getActivo());
        return mapper.toResponse(repository.save(actualizado));
    }

    /**
     * Se desactiva en vez de borrar porque los menús (y por lo tanto los permisos) referencian el módulo.
     */
    @Transactional
    public void eliminar(Integer id) {
        Modulo modulo = obtenerEntidad(id);
        modulo.setActivo(false);
        repository.save(modulo);
    }

    private Modulo obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Módulo no encontrado: " + id));
    }
}
