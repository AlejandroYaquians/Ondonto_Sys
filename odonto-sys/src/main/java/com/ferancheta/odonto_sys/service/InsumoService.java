package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.InsumoRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoResponse;
import com.ferancheta.odonto_sys.entity.Insumo;
import com.ferancheta.odonto_sys.mapper.InsumoMapper;
import com.ferancheta.odonto_sys.repository.InsumoRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class InsumoService {

    private final InsumoRepository repository;
    private final ContextoAutenticacion contexto;
    private final InsumoMapper mapper;

    @Transactional(readOnly = true)
    public List<InsumoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<InsumoResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<InsumoResponse> listarConStockBajo() {
        return repository.findConStockBajo().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InsumoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public InsumoResponse crear(InsumoRequest request) {
        Insumo entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        entidad.setStockActual(request.stockActual());
        entidad.setStockMinimo(request.stockMinimo());
        entidad.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public InsumoResponse actualizar(Integer id, InsumoRequest request) {
        Insumo existente = obtenerEntidad(id);
        Insumo actualizado = mapper.toEntity(request);
        actualizado.setIdInsumo(existente.getIdInsumo());
        actualizado.setActivo(existente.getActivo());
        actualizado.setStockActual(existente.getStockActual());
        actualizado.setStockMinimo(request.stockMinimo());
        actualizado.setIdUsuarioCreacion(existente.getIdUsuarioCreacion());
        actualizado.setIdUsuarioModificacion(contexto.usuarioActual().getIdUsuario());
        return mapper.toResponse(repository.save(actualizado));
    }


    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public InsumoResponse actualizarStockMinimo(Integer id, Integer stockMinimo) {
        Insumo insumo = obtenerEntidad(id);
        insumo.setStockMinimo(stockMinimo);
        return mapper.toResponse(repository.save(insumo));
    }


    @Transactional
    public void eliminar(Integer id) {
        Insumo insumo = obtenerEntidad(id);
        insumo.setActivo(false);
        repository.save(insumo);
    }


    private Insumo obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado: " + id));
    }
}
