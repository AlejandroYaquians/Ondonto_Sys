package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CatMetodoPagoRequest;
import com.ferancheta.odonto_sys.dto.response.CatMetodoPagoResponse;
import com.ferancheta.odonto_sys.entity.CatMetodoPago;
import com.ferancheta.odonto_sys.mapper.CatMetodoPagoMapper;
import com.ferancheta.odonto_sys.repository.CatMetodoPagoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CatMetodoPagoService {

    private final CatMetodoPagoRepository repository;
    private final CatMetodoPagoMapper mapper;

    @Transactional(readOnly = true)
    public List<CatMetodoPagoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CatMetodoPagoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatMetodoPagoResponse crear(CatMetodoPagoRequest request) {
        CatMetodoPago entidad = mapper.toEntity(request);
        aplicarValorPorDefecto(entidad);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CatMetodoPagoResponse actualizar(Integer id, CatMetodoPagoRequest request) {
        CatMetodoPago existente = obtenerEntidad(id);
        CatMetodoPago actualizada = mapper.toEntity(request);
        actualizada.setIdMetodoPago(existente.getIdMetodoPago());
        aplicarValorPorDefecto(actualizada);
        return mapper.toResponse(repository.save(actualizada));
    }

    /**
     * El builder de Lombok no aplica el valor por defecto (=0) de la entidad,
     * así que se completa aquí si el request no lo envía (ej. Efectivo/Transferencia sin comisión).
     */
    private void aplicarValorPorDefecto(CatMetodoPago entidad) {
        if (entidad.getComisionPorcentaje() == null) {
            entidad.setComisionPorcentaje(BigDecimal.ZERO);
        }
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private CatMetodoPago obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Método de pago no encontrado: " + id));
    }
}
