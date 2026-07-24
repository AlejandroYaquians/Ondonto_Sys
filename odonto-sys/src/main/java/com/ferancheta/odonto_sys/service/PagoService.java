package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.PagoRequest;
import com.ferancheta.odonto_sys.dto.response.PagoResponse;
import com.ferancheta.odonto_sys.entity.Pago;
import com.ferancheta.odonto_sys.mapper.PagoMapper;
import com.ferancheta.odonto_sys.repository.CatMetodoPagoRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import com.ferancheta.odonto_sys.repository.PagoRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

/**
 * NOTA: este servicio genera el numero_comprobante automáticamente, pero NO calcula
 * montoBruto/montoNeto/comisionTarjeta a partir de los detalles del pago (PagoDetalle) —
 * esos montos se reciben tal como los envía el cliente. Las reglas "descontar comision_tarjeta
 * cuando el método es tarjeta" y "calcular comision_doctor" quedan pendientes de definir
 * explícitamente, porque requieren datos (como el doctor) que no están directamente
 * disponibles en Pago/PagoDetalle con la relación actual.
 */
@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final CatMetodoPagoRepository catMetodoPagoRepository;
    private final UsuarioRepository usuarioRepository;
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
        Pago entidad = mapper.toEntity(request);
        entidad.setEstado("pendiente");
        entidad.setNumeroComprobante(generarNumeroComprobante());
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public PagoResponse actualizar(Integer id, PagoRequest request) {
        Pago existente = obtenerEntidad(id);
        Pago actualizado = mapper.toEntity(request);
        actualizado.setIdPago(existente.getIdPago());
        actualizado.setEstado(existente.getEstado());
        actualizado.setNumeroComprobante(existente.getNumeroComprobante());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(repository.save(actualizado));
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
