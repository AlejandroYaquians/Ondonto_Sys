package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ComisionRequest;
import com.ferancheta.odonto_sys.dto.response.ComisionResponse;
import com.ferancheta.odonto_sys.entity.Comision;
import com.ferancheta.odonto_sys.mapper.ComisionMapper;
import com.ferancheta.odonto_sys.repository.ComisionRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.PagoRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * NOTA: montoComision se recibe tal como lo envía el cliente; no se recalcula aquí
 * (precio_aplicado y costo_laboratorio viven en PagoDetalle, no en Comision), por lo que
 * automatizar el cálculo completo requiere primero decidir cómo enlazar Comision con el
 * PagoDetalle específico que la origina.
 */
@Service
@RequiredArgsConstructor
public class ComisionService {

    private final ComisionRepository repository;
    private final DoctorRepository doctorRepository;
    private final PagoRepository pagoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ComisionMapper mapper;

    @Transactional(readOnly = true)
    public List<ComisionResponse> listarPorDoctorYEstado(Integer idDoctor, String estado) {
        return repository.findByDoctor_IdDoctorAndEstado(idDoctor, estado).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ComisionResponse> listarPorPago(Integer idPago) {
        return repository.findByPago_IdPago(idPago).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ComisionResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ComisionResponse crear(ComisionRequest request) {
        Comision entidad = mapper.toEntity(request);
        entidad.setEstado("pendiente");
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public ComisionResponse actualizar(Integer id, ComisionRequest request) {
        Comision existente = obtenerEntidad(id);
        Comision actualizada = mapper.toEntity(request);
        actualizada.setIdComision(existente.getIdComision());
        actualizada.setEstado(existente.getEstado());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public ComisionResponse cambiarEstado(Integer id, String estado) {
        Comision comision = obtenerEntidad(id);
        comision.setEstado(estado);
        return mapper.toResponse(repository.save(comision));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(Comision entidad, ComisionRequest request) {
        entidad.setDoctor(doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor())));
        entidad.setPago(pagoRepository.findById(request.idPago())
                .orElseThrow(() -> new EntityNotFoundException("Pago no encontrado: " + request.idPago())));

        if (request.idUsuarioCreacion() != null) {
            entidad.setUsuarioCreacion(usuarioRepository.findById(request.idUsuarioCreacion())
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuarioCreacion())));
        } else {
            entidad.setUsuarioCreacion(null);
        }
    }

    private Comision obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comisión no encontrada: " + id));
    }
}
