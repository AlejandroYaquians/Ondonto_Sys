package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.HistorialClinicoRequest;
import com.ferancheta.odonto_sys.dto.response.HistorialClinicoResponse;
import com.ferancheta.odonto_sys.entity.EstadoCita;
import com.ferancheta.odonto_sys.entity.Cita;
import com.ferancheta.odonto_sys.entity.HistorialClinico;
import com.ferancheta.odonto_sys.mapper.HistorialClinicoMapper;
import com.ferancheta.odonto_sys.repository.EstadoCitaRepository;
import com.ferancheta.odonto_sys.repository.CitaRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.HistorialClinicoRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialClinicoService {

    private static final String ESTADO_ATENDIDA = "Atendida";

    private final HistorialClinicoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final DoctorRepository doctorRepository;
    private final CitaRepository citaRepository;
    private final EstadoCitaRepository estadoCitaRepository;
    private final ContextoAutenticacion contexto;
    private final BitacoraService bitacoraService;
    private final HistorialClinicoMapper mapper;

    @Transactional(readOnly = true)
    public List<HistorialClinicoResponse> listar() {
        if (contexto.esDoctor()) {
            return repository.findByDoctor_IdDoctor(contexto.doctorActual().getIdDoctor())
                    .stream().map(mapper::toResponse).toList();
        }
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<HistorialClinicoResponse> listarPorPaciente(Integer idPaciente) {
        return repository.findByPaciente_IdPaciente(idPaciente).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public HistorialClinicoResponse buscarPorId(Integer id) {
        HistorialClinico historial = obtenerEntidad(id);
        return mapper.toResponse(historial);
    }

    @Transactional
    public HistorialClinicoResponse crear(HistorialClinicoRequest request) {
        validarAccesoADoctor(request.idDoctor());
        HistorialClinico historial = mapper.toEntity(request);
        historial.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(historial, request);
        HistorialClinico guardado = repository.save(historial);
        marcarCitaComoAtendida(guardado.getCita());
        HistorialClinicoResponse resultado = mapper.toResponse(guardado);
        bitacoraService.registrarCambio("historial_clinico", resultado.idHistorialClinico(), "INSERT", null, resultado);
        return resultado;
    }

    @Transactional
    public HistorialClinicoResponse actualizar(Integer id, HistorialClinicoRequest request) {
        HistorialClinico existente = obtenerEntidad(id);
        validarPropietario(existente);
        validarAccesoADoctor(request.idDoctor());
        HistorialClinicoResponse antes = mapper.toResponse(existente);
        HistorialClinico actualizado = mapper.toEntity(request);
        actualizado.setIdHistorialClinico(existente.getIdHistorialClinico());
        actualizado.setFecha(existente.getFecha());
        actualizado.setIdUsuarioCreacion(existente.getIdUsuarioCreacion());
        actualizado.setIdUsuarioModificacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(actualizado, request);
        HistorialClinicoResponse despues = mapper.toResponse(repository.save(actualizado));
        bitacoraService.registrarCambio("historial_clinico", id, "UPDATE", antes, despues);
        return despues;
    }

    @Transactional
    public void eliminar(Integer id) {
        HistorialClinico historial = obtenerEntidad(id);
        validarPropietario(historial);
        HistorialClinicoResponse antes = mapper.toResponse(historial);
        repository.delete(historial);
        bitacoraService.registrarCambio("historial_clinico", id, "DELETE", antes, null);
    }

    private void marcarCitaComoAtendida(Cita cita) {
        if (cita == null) {
            return;
        }
        EstadoCita atendida = estadoCitaRepository.findByNombre(ESTADO_ATENDIDA)
                .orElseThrow(() -> new EntityNotFoundException("Estado de cita no encontrado: " + ESTADO_ATENDIDA));
        cita.setEstadoCita(atendida);
        citaRepository.save(cita);
    }

    private void validarPropietario(HistorialClinico historial) {
        if (contexto.esDoctor() && !historial.getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tiene acceso a este historial clínico");
        }
    }

    private void validarAccesoADoctor(Integer idDoctor) {
        if (contexto.esDoctor() && !contexto.doctorActual().getIdDoctor().equals(idDoctor)) {
            throw new AccessDeniedException("No puede registrar historial clínico de otro doctor");
        }
    }

    private void aplicarRelaciones(HistorialClinico historial, HistorialClinicoRequest request) {
        historial.setPaciente(pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente())));
        historial.setDoctor(doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor())));

        if (request.idCita() != null) {
            historial.setCita(citaRepository.findById(request.idCita())
                    .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada: " + request.idCita())));
        } else {
            historial.setCita(null);
        }
    }

    private HistorialClinico obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Historial clínico no encontrado: " + id));
    }
}
