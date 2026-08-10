package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.PagoRequest;
import com.ferancheta.odonto_sys.dto.response.PagoResponse;
import com.ferancheta.odonto_sys.entity.Pago;
import com.ferancheta.odonto_sys.mapper.PagoMapper;
import com.ferancheta.odonto_sys.repository.CatMetodoPagoRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import com.ferancheta.odonto_sys.repository.PagoRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;


@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final CatMetodoPagoRepository catMetodoPagoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContextoAutenticacion contexto;
    private final PagoMapper mapper;

    @Transactional(readOnly = true)
    public List<PagoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PagoResponse> listarPorPaciente(Integer idPaciente) {
        return repository.findByPaciente_IdPaciente(idPaciente).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PagoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public PagoResponse crear(PagoRequest request) {
        validarMontosMixtos(request);
        Pago entidad = mapper.toEntity(request);
        entidad.setEstado("pendiente");
        entidad.setNumeroComprobante(generarNumeroComprobante());
        entidad.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public PagoResponse actualizar(Integer id, PagoRequest request) {
        validarMontosMixtos(request);
        Pago existente = obtenerEntidad(id);
        Pago actualizado = mapper.toEntity(request);
        actualizado.setIdPago(existente.getIdPago());
        actualizado.setEstado(existente.getEstado());
        actualizado.setNumeroComprobante(existente.getNumeroComprobante());
        actualizado.setIdUsuarioCreacion(existente.getIdUsuarioCreacion());
        actualizado.setIdUsuarioModificacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(repository.save(actualizado));
    }


    private void validarMontosMixtos(PagoRequest request) {
        if (request.montoBruto() == null) {
            return;
        }
        BigDecimal efectivo = request.montoEfectivo() != null ? request.montoEfectivo() : BigDecimal.ZERO;
        BigDecimal tarjeta = request.montoTarjeta() != null ? request.montoTarjeta() : BigDecimal.ZERO;

        if (efectivo.add(tarjeta).compareTo(request.montoBruto()) != 0) {
            throw new IllegalArgumentException(
                    "monto_efectivo + monto_tarjeta debe ser igual a monto_bruto");
        }
    }

    @Transactional
    public PagoResponse cambiarEstado(Integer id, String estado) {
        Pago pago = obtenerEntidad(id);
        pago.setEstado(estado);
        return mapper.toResponse(repository.save(pago));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private String generarNumeroComprobante() {
        int anio = Year.now().getValue();
        String prefijo = "CP-" + anio + "-";
        long siguiente = repository.countByNumeroComprobanteStartingWith(prefijo) + 1;
        return prefijo + String.format("%05d", siguiente);
    }

    private void aplicarRelaciones(Pago entidad, PagoRequest request) {
        entidad.setPaciente(pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente())));
        entidad.setMetodoPago(catMetodoPagoRepository.findById(request.idMetodoPago())
                .orElseThrow(() -> new EntityNotFoundException("Método de pago no encontrado: " + request.idMetodoPago())));
        entidad.setUsuario(usuarioRepository.findById(request.idUsuario())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuario())));
    }

    private Pago obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pago no encontrado: " + id));
    }
}
