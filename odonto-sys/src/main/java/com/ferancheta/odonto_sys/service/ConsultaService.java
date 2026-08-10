package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ConsultaRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaResponse;
import com.ferancheta.odonto_sys.entity.Consulta;
import com.ferancheta.odonto_sys.mapper.ConsultaMapper;
import com.ferancheta.odonto_sys.repository.CitaRepository;
import com.ferancheta.odonto_sys.repository.ConsultaRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
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
public class ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final PacienteRepository pacienteRepository;
    private final DoctorRepository doctorRepository;
    private final CitaRepository citaRepository;
    private final ContextoAutenticacion contexto;
    private final ConsultaMapper mapper;

    @Transactional(readOnly = true)
    public List<ConsultaResponse> listar() {
        if (contexto.esDoctor()) {
            return consultaRepository.findByDoctor_IdDoctor(contexto.doctorActual().getIdDoctor())
                    .stream().map(mapper::toResponse).toList();
        }
        return consultaRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ConsultaResponse> listarPorPaciente(Integer idPaciente) {
        List<Consulta> consultas = consultaRepository.findByPaciente_IdPaciente(idPaciente);
        if (contexto.esDoctor()) {
            Integer idDoctorActual = contexto.doctorActual().getIdDoctor();
            consultas = consultas.stream().filter(c -> c.getDoctor().getIdDoctor().equals(idDoctorActual)).toList();
        }
        return consultas.stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ConsultaResponse> listarPorDoctor(Integer idDoctor) {
        validarAccesoADoctor(idDoctor);
        return consultaRepository.findByDoctor_IdDoctor(idDoctor).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaResponse buscarPorId(Integer id) {
        Consulta consulta = obtenerEntidad(id);
        validarPropietario(consulta);
        return mapper.toResponse(consulta);
    }

    @Transactional
    public ConsultaResponse crear(ConsultaRequest request) {
        validarAccesoADoctor(request.idDoctor());
        Consulta consulta = mapper.toEntity(request);
        consulta.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(consulta, request);
        return mapper.toResponse(consultaRepository.save(consulta));
    }

    @Transactional
    public ConsultaResponse actualizar(Integer id, ConsultaRequest request) {
        Consulta existente = obtenerEntidad(id);
        validarPropietario(existente);
        validarAccesoADoctor(request.idDoctor());
        Consulta actualizada = mapper.toEntity(request);
        actualizada.setIdConsulta(existente.getIdConsulta());
        actualizada.setIdUsuarioCreacion(existente.getIdUsuarioCreacion());
        actualizada.setIdUsuarioModificacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(consultaRepository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        Consulta consulta = obtenerEntidad(id);
        validarPropietario(consulta);
        consultaRepository.delete(consulta);
    }

    private void validarPropietario(Consulta consulta) {
        if (contexto.esDoctor() && !consulta.getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tiene acceso a esta consulta");
        }
    }

    private void validarAccesoADoctor(Integer idDoctor) {
        if (contexto.esDoctor() && !contexto.doctorActual().getIdDoctor().equals(idDoctor)) {
            throw new AccessDeniedException("No puede operar consultas de otro doctor");
        }
    }

    private void aplicarRelaciones(Consulta consulta, ConsultaRequest request) {
        consulta.setPaciente(pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente())));
        consulta.setDoctor(doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor())));

        if (request.idCita() != null) {
            consulta.setCita(citaRepository.findById(request.idCita())
                    .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada: " + request.idCita())));
        } else {
            consulta.setCita(null);
        }
    }

    private Consulta obtenerEntidad(Integer id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada: " + id));
    }
}
