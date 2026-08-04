package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.InsumoRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoResponse;
import com.ferancheta.odonto_sys.entity.Insumo;
import com.ferancheta.odonto_sys.mapper.InsumoMapper;
import com.ferancheta.odonto_sys.repository.InsumoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * El stock_minimo NO se toca desde crear()/actualizar(): solo el rol ADMIN puede
 * definirlo o modificarlo, a través de actualizarStockMinimo() (regla de negocio del proyecto).
 */
@Service
@RequiredArgsConstructor
public class InsumoService {

    private final InsumoRepository repository;
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
    public InsumoResponse crear(InsumoRequest request) {
        Insumo entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        entidad.setStockMinimo(0);
        aplicarValoresPorDefecto(entidad);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public InsumoResponse actualizar(Integer id, InsumoRequest request) {
        Insumo existente = obtenerEntidad(id);
        Insumo actualizado = mapper.toEntity(request);
        actualizado.setIdInsumo(existente.getIdInsumo());
        actualizado.setActivo(existente.getActivo());
        actualizado.setStockMinimo(existente.getStockMinimo());
        aplicarValoresPorDefecto(actualizado);
        return mapper.toResponse(repository.save(actualizado));
    }

    /**
     * Único punto del sistema donde se puede definir/modificar el stock mínimo,
     * restringido al rol ADMIN.
     */
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public InsumoResponse actualizarStockMinimo(Integer id, Integer stockMinimo) {
        Insumo insumo = obtenerEntidad(id);
        insumo.setStockMinimo(stockMinimo);
        return mapper.toResponse(repository.save(insumo));
    }

    /**
     * Se desactiva en vez de borrar porque queda referenciado desde insumo_movimiento,
     * insumo_servicio y consulta_insumo.
     */
    @Transactional
    public void eliminar(Integer id) {
        Insumo insumo = obtenerEntidad(id);
        insumo.setActivo(false);
        repository.save(insumo);
    }

    /**
     * El builder de Lombok no aplica el valor por defecto (=0) de la entidad,
     * así que se completa acá si el request no lo envía.
     */
    private void aplicarValoresPorDefecto(Insumo insumo) {
        if (insumo.getStockActual() == null) {
            insumo.setStockActual(0);
        }
    }

    private Insumo obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado: " + id));
    }
}
