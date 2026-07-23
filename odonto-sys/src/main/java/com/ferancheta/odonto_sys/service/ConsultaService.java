package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ConsultaRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaResponse;
import com.ferancheta.odonto_sys.entity.Consulta;
import com.ferancheta.odonto_sys.mapper.ConsultaMapper;
import com.ferancheta.odonto_sys.repository.CitaRepository;
import com.ferancheta.odonto_sys.repository.ConsultaRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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
    private final ConsultaMapper mapper;

    @Transactional(readOnly = true)
    public List<ConsultaResponse> listar() {
        return consultaRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ConsultaResponse> listarPorPaciente(Integer idPaciente) {
        return consultaRepository.findByPaciente_IdPaciente(idPaciente).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ConsultaResponse> listarPorDoctor(Integer idDoctor) {
        return consultaRepository.findByDoctor_IdDoctor(idDoctor).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ConsultaResponse crear(ConsultaRequest request) {
        Consulta consulta = mapper.toEntity(request);
        aplicarRelaciones(consulta, request);
        return mapper.toResponse(consultaRepository.save(consulta));
    }

    @Transactional
    public ConsultaResponse actualizar(Integer id, ConsultaRequest request) {
        Consulta existente = obtenerEntidad(id);
        Consulta actualizada = mapper.toEntity(request);
        actualizada.setIdConsulta(existente.getIdConsulta());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(consultaRepository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        consultaRepository.delete(obtenerEntidad(id));
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
