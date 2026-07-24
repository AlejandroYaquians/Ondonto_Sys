package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ConsultaInsumoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaInsumoResponse;
import com.ferancheta.odonto_sys.entity.ConsultaInsumo;
import com.ferancheta.odonto_sys.entity.Insumo;
import com.ferancheta.odonto_sys.mapper.ConsultaInsumoMapper;
import com.ferancheta.odonto_sys.repository.ConsultaInsumoRepository;
import com.ferancheta.odonto_sys.repository.ConsultaTratamientoRepository;
import com.ferancheta.odonto_sys.repository.InsumoRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Al registrar un consumo de insumo en una consulta, se descuenta el stock_actual
 * del insumo correspondiente (regla de negocio del proyecto).
 */
@Service
@RequiredArgsConstructor
public class ConsultaInsumoService {

    private final ConsultaInsumoRepository repository;
    private final ConsultaTratamientoRepository consultaTratamientoRepository;
    private final InsumoRepository insumoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConsultaInsumoMapper mapper;

    @Transactional(readOnly = true)
    public List<ConsultaInsumoResponse> listarPorConsultaTratamiento(Integer idConsultaTratamiento) {
        return repository.findByConsultaTratamiento_IdConsultaTratamiento(idConsultaTratamiento)
                .stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaInsumoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ConsultaInsumoResponse crear(ConsultaInsumoRequest request) {
        ConsultaInsumo entidad = mapper.toEntity(request);

        entidad.setConsultaTratamiento(consultaTratamientoRepository.findById(request.idConsultaTratamiento())
                .orElseThrow(() -> new EntityNotFoundException("Consulta tratamiento no encontrada: " + request.idConsultaTratamiento())));

        Insumo insumo = insumoRepository.findById(request.idInsumo())
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado: " + request.idInsumo()));
        entidad.setInsumo(insumo);

        entidad.setUsuarioCreacion(usuarioRepository.findById(request.idUsuarioCreacion())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuarioCreacion())));

        descontarStock(insumo, request.cantidadUsada());

        return mapper.toResponse(repository.save(entidad));
    }

    /**
     * Revierte el descuento de stock del insumo original y aplica el nuevo consumo,
     * incluso si cambió el insumo o la consulta_tratamiento.
     */
    @Transactional
    public ConsultaInsumoResponse actualizar(Integer id, ConsultaInsumoRequest request) {
        ConsultaInsumo existente = obtenerEntidad(id);
        restaurarStock(existente.getInsumo(), existente.getCantidadUsada());

        ConsultaInsumo actualizado = mapper.toEntity(request);
        actualizado.setIdConsultaInsumo(existente.getIdConsultaInsumo());
        actualizado.setFecha(existente.getFecha());

        actualizado.setConsultaTratamiento(consultaTratamientoRepository.findById(request.idConsultaTratamiento())
                .orElseThrow(() -> new EntityNotFoundException("Consulta tratamiento no encontrada: " + request.idConsultaTratamiento())));

        Insumo insumo = insumoRepository.findById(request.idInsumo())
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado: " + request.idInsumo()));
        actualizado.setInsumo(insumo);

        actualizado.setUsuarioCreacion(usuarioRepository.findById(request.idUsuarioCreacion())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuarioCreacion())));

        descontarStock(insumo, request.cantidadUsada());

        return mapper.toResponse(repository.save(actualizado));
    }

    /**
     * Se restaura el stock del insumo al eliminar el registro, para no dejar el stock desfasado.
     */
    @Transactional
    public void eliminar(Integer id) {
        ConsultaInsumo entidad = obtenerEntidad(id);
        restaurarStock(entidad.getInsumo(), entidad.getCantidadUsada());
        repository.delete(entidad);
    }

    private void descontarStock(Insumo insumo, Integer cantidad) {
        int stockActual = insumo.getStockActual() != null ? insumo.getStockActual() : 0;
        insumo.setStockActual(stockActual - cantidad);
        insumoRepository.save(insumo);
    }

    private void restaurarStock(Insumo insumo, Integer cantidad) {
        int stockActual = insumo.getStockActual() != null ? insumo.getStockActual() : 0;
        insumo.setStockActual(stockActual + cantidad);
        insumoRepository.save(insumo);
    }

    private ConsultaInsumo obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta insumo no encontrada: " + id));
    }
}
