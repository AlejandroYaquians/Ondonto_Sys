package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ConsultaNotaRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaNotaResponse;
import com.ferancheta.odonto_sys.entity.ConsultaNota;
import com.ferancheta.odonto_sys.mapper.ConsultaNotaMapper;
import com.ferancheta.odonto_sys.repository.ConsultaNotaRepository;
import com.ferancheta.odonto_sys.repository.ConsultaRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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
    private final ConsultaNotaMapper mapper;

    @Transactional(readOnly = true)
    public List<ConsultaNotaResponse> listarPorConsulta(Integer idConsulta) {
        return repository.findByConsulta_IdConsulta(idConsulta).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaNotaResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
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
        ConsultaNota actualizada = mapper.toEntity(request);
        actualizada.setIdNota(existente.getIdNota());
        actualizada.setFecha(existente.getFecha());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(ConsultaNota entidad, ConsultaNotaRequest request) {
        entidad.setConsulta(consultaRepository.findById(request.idConsulta())
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada: " + request.idConsulta())));
        entidad.setDoctor(doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor())));
        entidad.setUsuarioCreacion(usuarioRepository.findById(request.idUsuarioCreacion())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuarioCreacion())));
    }

    private ConsultaNota obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nota de consulta no encontrada: " + id));
    }
}
