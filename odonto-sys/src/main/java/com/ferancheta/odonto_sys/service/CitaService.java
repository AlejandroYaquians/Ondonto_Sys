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
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitaService {

    private static final long DURACION_DEFECTO_MINUTOS = 30;

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final DoctorRepository doctorRepository;
    private final CatEstadoCitaRepository catEstadoCitaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CitaMapper mapper;

    @Transactional(readOnly = true)
    public List<CitaResponse> listar() {
        return citaRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listarPorDoctorYFecha(Integer idDoctor, LocalDate fecha) {
        return citaRepository.findByDoctor_IdDoctorAndFecha(idDoctor, fecha).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listarPorPaciente(Integer idPaciente) {
        return citaRepository.findByPaciente_IdPaciente(idPaciente).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CitaResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public CitaResponse crear(CitaRequest request) {
        validarTraslape(request, null);
        Cita cita = mapper.toEntity(request);
        aplicarRelaciones(cita, request);
        return mapper.toResponse(citaRepository.save(cita));
    }

    @Transactional
    public CitaResponse actualizar(Integer id, CitaRequest request) {
        Cita existente = obtenerEntidad(id);
        validarTraslape(request, id);
        Cita actualizada = mapper.toEntity(request);
        actualizada.setIdCita(existente.getIdCita());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(citaRepository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        citaRepository.delete(obtenerEntidad(id));
    }

    /**
     * Si no se especifica horaFin, se asume una duración por defecto de 30 minutos
     * solo para efectos de validar traslapes (no se persiste ese valor calculado).
     */
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
