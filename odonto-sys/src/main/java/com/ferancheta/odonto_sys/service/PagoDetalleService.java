package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.PagoDetalleRequest;
import com.ferancheta.odonto_sys.dto.response.PagoDetalleResponse;
import com.ferancheta.odonto_sys.entity.PagoDetalle;
import com.ferancheta.odonto_sys.mapper.PagoDetalleMapper;
import com.ferancheta.odonto_sys.repository.CatMetodoPagoRepository;
import com.ferancheta.odonto_sys.repository.PagoDetalleRepository;
import com.ferancheta.odonto_sys.repository.PagoRepository;
import com.ferancheta.odonto_sys.repository.ServicioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * NOTA: comisionDoctorCalculada NO se calcula aquí. La fórmula del proyecto es
 * (precio_aplicado - costo_laboratorio) * porcentaje_comision, pero PagoDetalle no tiene
 * una relación directa a Doctor (el porcentaje_comision vive en Doctor). Falta definir
 * cómo se vincula el detalle de pago con el doctor que atendió antes de automatizar esto.
 */
@Service
@RequiredArgsConstructor
public class PagoDetalleService {

    private final PagoDetalleRepository repository;
    private final PagoRepository pagoRepository;
    private final ServicioRepository servicioRepository;
    private final CatMetodoPagoRepository catMetodoPagoRepository;
    private final PagoDetalleMapper mapper;

    @Transactional(readOnly = true)
    public List<PagoDetalleResponse> listarPorPago(Integer idPago) {
        return repository.findByPago_IdPago(idPago).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PagoDetalleResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public PagoDetalleResponse crear(PagoDetalleRequest request) {
        PagoDetalle entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public PagoDetalleResponse actualizar(Integer id, PagoDetalleRequest request) {
        PagoDetalle existente = obtenerEntidad(id);
        PagoDetalle actualizado = mapper.toEntity(request);
        actualizado.setIdDetallePago(existente.getIdDetallePago());
        actualizado.setComisionDoctorCalculada(existente.getComisionDoctorCalculada());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(PagoDetalle entidad, PagoDetalleRequest request) {
        entidad.setPago(pagoRepository.findById(request.idPago())
                .orElseThrow(() -> new EntityNotFoundException("Pago no encontrado: " + request.idPago())));
        entidad.setServicio(servicioRepository.findById(request.idServicio())
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado: " + request.idServicio())));
        entidad.setMetodoPago(catMetodoPagoRepository.findById(request.idMetodoPago())
                .orElseThrow(() -> new EntityNotFoundException("Método de pago no encontrado: " + request.idMetodoPago())));
    }

    private PagoDetalle obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Detalle de pago no encontrado: " + id));
    }
}
