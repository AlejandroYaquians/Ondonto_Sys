package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ConsultaDiagnosticoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaDiagnosticoResponse;
import com.ferancheta.odonto_sys.entity.ConsultaDiagnostico;
import com.ferancheta.odonto_sys.mapper.ConsultaDiagnosticoMapper;
import com.ferancheta.odonto_sys.repository.CatDiagnosticoRepository;
import com.ferancheta.odonto_sys.repository.ConsultaDiagnosticoRepository;
import com.ferancheta.odonto_sys.repository.ConsultaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultaDiagnosticoService {

    private final ConsultaDiagnosticoRepository repository;
    private final ConsultaRepository consultaRepository;
    private final CatDiagnosticoRepository catDiagnosticoRepository;
    private final ConsultaDiagnosticoMapper mapper;

    @Transactional(readOnly = true)
    public List<ConsultaDiagnosticoResponse> listarPorConsulta(Integer idConsulta) {
        return repository.findByConsulta_IdConsulta(idConsulta).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaDiagnosticoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ConsultaDiagnosticoResponse crear(ConsultaDiagnosticoRequest request) {
        ConsultaDiagnostico entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public ConsultaDiagnosticoResponse actualizar(Integer id, ConsultaDiagnosticoRequest request) {
        ConsultaDiagnostico existente = obtenerEntidad(id);
        ConsultaDiagnostico actualizada = mapper.toEntity(request);
        actualizada.setIdConsultaDiagnostico(existente.getIdConsultaDiagnostico());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(ConsultaDiagnostico entidad, ConsultaDiagnosticoRequest request) {
        entidad.setConsulta(consultaRepository.findById(request.idConsulta())
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada: " + request.idConsulta())));
        entidad.setDiagnostico(catDiagnosticoRepository.findById(request.idDiagnostico())
                .orElseThrow(() -> new EntityNotFoundException("Diagnóstico no encontrado: " + request.idDiagnostico())));
    }

    private ConsultaDiagnostico obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta diagnóstico no encontrada: " + id));
    }
}
