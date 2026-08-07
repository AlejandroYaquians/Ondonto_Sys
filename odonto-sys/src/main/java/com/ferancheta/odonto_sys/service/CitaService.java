package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CitaRequest;
import com.ferancheta.odonto_sys.dto.response.CitaResponse;
import com.ferancheta.odonto_sys.entity.Cita;
import com.ferancheta.odonto_sys.mapper.CitaMapper;
import com.ferancheta.odonto_sys.repository.CatEstadoCitaRepository;
import com.ferancheta.odonto_sys.repository.CitaRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@RequiredArgsConstructor
public class CitaService {

    private static final long DURACION_DEFECTO_MINUTOS = 30;

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final DoctorRepository doctorRepository;
    private final CatEstadoCitaRepository catEstadoCitaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContextoAutenticacion contexto;
    private final CitaMapper mapper;

    @Transactional(readOnly = true)
    public List<CitaResponse> listar() {
        if (contexto.esDoctor()) {
            return citaRepository.findByDoctor_IdDoctor(contexto.doctorActual().getIdDoctor())
                    .stream().map(mapper::toResponse).toList();
        }
        return citaRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listarPorDoctorYFecha(Integer idDoctor, LocalDate fecha) {
        validarAccesoADoctor(idDoctor);
        return citaRepository.findByDoctor_IdDoctorAndFecha(idDoctor, fecha).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listarPorPaciente(Integer idPaciente) {
        List<Cita> citas = citaRepository.findByPaciente_IdPaciente(idPaciente);
        if (contexto.esDoctor()) {
            Integer idDoctorActual = contexto.doctorActual().getIdDoctor();
            citas = citas.stream().filter(c -> c.getDoctor().getIdDoctor().equals(idDoctorActual)).toList();
        }
        return citas.stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CitaResponse buscarPorId(Integer id) {
        Cita cita = obtenerEntidad(id);
        validarPropietario(cita);
        return mapper.toResponse(cita);
    }

    @Transactional
    public CitaResponse crear(CitaRequest request) {
        validarAccesoADoctor(request.idDoctor());
        validarTraslape(request, null);
        Cita cita = mapper.toEntity(request);
        aplicarRelaciones(cita, request);
        return mapper.toResponse(citaRepository.save(cita));
    }

    @Transactional
    public CitaResponse actualizar(Integer id, CitaRequest request) {
        Cita existente = obtenerEntidad(id);
        validarPropietario(existente);
        validarAccesoADoctor(request.idDoctor());
        validarTraslape(request, id);
        Cita actualizada = mapper.toEntity(request);
        actualizada.setIdCita(existente.getIdCita());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(citaRepository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        Cita cita = obtenerEntidad(id);
        validarPropietario(cita);
        citaRepository.delete(cita);
    }


    private void validarTraslape(CitaRequest request, Integer idCitaExcluir) {
        LocalTime horaFin = request.horaFin() != null
                ? request.horaFin()
                : request.hora().plusMinutes(DURACION_DEFECTO_MINUTOS);

        List<Cita> traslapes = citaRepository.findTraslapes(
                request.idDoctor(), request.fecha(), request.hora(), horaFin, idCitaExcluir);

        if (!traslapes.isEmpty()) {
            throw new IllegalStateException("El doctor ya tiene una cita programada en ese horario");
        }
    }

    private void validarPropietario(Cita cita) {
        if (contexto.esDoctor() && !cita.getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tiene acceso a esta cita");
        }
    }

    private void validarAccesoADoctor(Integer idDoctor) {
        if (contexto.esDoctor() && !contexto.doctorActual().getIdDoctor().equals(idDoctor)) {
            throw new AccessDeniedException("No puede operar citas de otro doctor");
        }
    }

    private void aplicarRelaciones(Cita cita, CitaRequest request) {
        cita.setPaciente(pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente())));
        cita.setDoctor(doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor())));
        cita.setEstadoCita(catEstadoCitaRepository.findById(request.idEstadoCita())
                .orElseThrow(() -> new EntityNotFoundException("Estado de cita no encontrado: " + request.idEstadoCita())));
        cita.setUsuario(usuarioRepository.findById(request.idUsuario())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuario())));
    }

    private Cita obtenerEntidad(Integer id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada: " + id));
    }
}
