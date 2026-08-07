package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ConsultaNotaRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaNotaResponse;
import com.ferancheta.odonto_sys.entity.Consulta;
import com.ferancheta.odonto_sys.entity.ConsultaNota;
import com.ferancheta.odonto_sys.mapper.ConsultaNotaMapper;
import com.ferancheta.odonto_sys.repository.ConsultaNotaRepository;
import com.ferancheta.odonto_sys.repository.ConsultaRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultaNotaService {

    private final ConsultaNotaRepository repository;
    private final ConsultaRepository consultaRepository;
    private final DoctorRepository doctorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContextoAutenticacion contexto;
    private final ConsultaNotaMapper mapper;

    @Transactional(readOnly = true)
    public List<ConsultaNotaResponse> listarPorConsulta(Integer idConsulta) {
        obtenerConsultaVerificada(idConsulta);
        return repository.findByConsulta_IdConsulta(idConsulta).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaNotaResponse buscarPorId(Integer id) {
        ConsultaNota entidad = obtenerEntidad(id);
        validarPropietario(entidad);
        return mapper.toResponse(entidad);
    }

    @Transactional
    public ConsultaNotaResponse crear(ConsultaNotaRequest request) {
        ConsultaNota entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public ConsultaNotaResponse actualizar(Integer id, ConsultaNotaRequest request) {
        ConsultaNota existente = obtenerEntidad(id);
        validarPropietario(existente);
        ConsultaNota actualizada = mapper.toEntity(request);
        actualizada.setIdNota(existente.getIdNota());
        actualizada.setFecha(existente.getFecha());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        ConsultaNota entidad = obtenerEntidad(id);
        validarPropietario(entidad);
        repository.delete(entidad);
    }

    private void aplicarRelaciones(ConsultaNota entidad, ConsultaNotaRequest request) {
        entidad.setConsulta(obtenerConsultaVerificada(request.idConsulta()));
        entidad.setDoctor(doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor())));
        entidad.setUsuarioCreacion(usuarioRepository.findById(request.idUsuarioCreacion())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuarioCreacion())));
    }

    private Consulta obtenerConsultaVerificada(Integer idConsulta) {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada: " + idConsulta));
        if (contexto.esDoctor() && !consulta.getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tiene acceso a esta consulta");
        }
        return consulta;
    }

    private void validarPropietario(ConsultaNota entidad) {
        if (contexto.esDoctor()
                && !entidad.getConsulta().getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tiene acceso a esta nota");
        }
    }

    private ConsultaNota obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nota de consulta no encontrada: " + id));
    }
}
