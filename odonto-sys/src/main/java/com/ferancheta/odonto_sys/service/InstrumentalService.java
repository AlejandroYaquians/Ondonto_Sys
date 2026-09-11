package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.InstrumentalRequest;
import com.ferancheta.odonto_sys.dto.response.InstrumentalResponse;
import com.ferancheta.odonto_sys.entity.Instrumental;
import com.ferancheta.odonto_sys.mapper.InstrumentalMapper;
import com.ferancheta.odonto_sys.repository.InstrumentalRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class InstrumentalService {

    private final InstrumentalRepository repository;
    private final ContextoAutenticacion contexto;
    private final InstrumentalMapper mapper;

    @Transactional(readOnly = true)
    public List<InstrumentalResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<InstrumentalResponse> listarActivos() {
        return repository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<InstrumentalResponse> listarConStockBajo() {
        return repository.findInstrumentalConStockBajo().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InstrumentalResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public InstrumentalResponse crear(InstrumentalRequest request) {
        Instrumental entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        entidad.setStockActual(request.stockActual());
        entidad.setStockMinimo(request.stockMinimo());
        entidad.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public InstrumentalResponse actualizar(Integer id, InstrumentalRequest request) {
        Instrumental existente = obtenerEntidad(id);
        Instrumental actualizado = mapper.toEntity(request);
        actualizado.setIdInstrumental(existente.getIdInstrumental());
        actualizado.setActivo(existente.getActivo());
        actualizado.setStockActual(existente.getStockActual());
        actualizado.setStockMinimo(request.stockMinimo());
        actualizado.setIdUsuarioCreacion(existente.getIdUsuarioCreacion());
        actualizado.setIdUsuarioModificacion(contexto.usuarioActual().getIdUsuario());
        return mapper.toResponse(repository.save(actualizado));
    }


    @Transactional
    public void eliminar(Integer id) {
        Instrumental instrumental = obtenerEntidad(id);
        instrumental.setActivo(false);
        repository.save(instrumental);
    }


    private Instrumental obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Instrumental no encontrado: " + id));
    }
}
