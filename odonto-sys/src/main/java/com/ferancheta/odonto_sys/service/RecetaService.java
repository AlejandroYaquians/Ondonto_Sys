package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.RecetaRequest;
import com.ferancheta.odonto_sys.dto.response.RecetaResponse;
import com.ferancheta.odonto_sys.entity.Receta;
import com.ferancheta.odonto_sys.mapper.RecetaMapper;
import com.ferancheta.odonto_sys.repository.ConsultaRepository;
import com.ferancheta.odonto_sys.repository.RecetaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecetaService {

    private final RecetaRepository repository;
    private final ConsultaRepository consultaRepository;
    private final RecetaMapper mapper;

    @Transactional(readOnly = true)
    public List<RecetaResponse> listarPorConsulta(Integer idConsulta) {
        return repository.findByConsulta_IdConsulta(idConsulta).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public RecetaResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public RecetaResponse crear(RecetaRequest request) {
        Receta entidad = mapper.toEntity(request);
        entidad.setConsulta(consultaRepository.findById(request.idConsulta())
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada: " + request.idConsulta())));
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public RecetaResponse actualizar(Integer id, RecetaRequest request) {
        Receta existente = obtenerEntidad(id);
        Receta actualizada = mapper.toEntity(request);
        actualizada.setIdReceta(existente.getIdReceta());
        actualizada.setConsulta(consultaRepository.findById(request.idConsulta())
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada: " + request.idConsulta())));
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private Receta obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Receta no encontrada: " + id));
    }
}
