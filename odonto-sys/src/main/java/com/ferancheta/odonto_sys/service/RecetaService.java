package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.RecetaRequest;
import com.ferancheta.odonto_sys.dto.response.RecetaResponse;
import com.ferancheta.odonto_sys.entity.Consulta;
import com.ferancheta.odonto_sys.entity.Receta;
import com.ferancheta.odonto_sys.mapper.RecetaMapper;
import com.ferancheta.odonto_sys.repository.ConsultaRepository;
import com.ferancheta.odonto_sys.repository.RecetaRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecetaService {

    private final RecetaRepository repository;
    private final ConsultaRepository consultaRepository;
    private final ContextoAutenticacion contexto;
    private final RecetaMapper mapper;

    @Transactional(readOnly = true)
    public List<RecetaResponse> listarPorConsulta(Integer idConsulta) {
        obtenerConsultaVerificada(idConsulta);
        return repository.findByConsulta_IdConsulta(idConsulta).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public RecetaResponse buscarPorId(Integer id) {
        Receta entidad = obtenerEntidad(id);
        validarPropietario(entidad);
        return mapper.toResponse(entidad);
    }

    @Transactional
    public RecetaResponse crear(RecetaRequest request) {
        Receta entidad = mapper.toEntity(request);
        entidad.setConsulta(obtenerConsultaVerificada(request.idConsulta()));
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public RecetaResponse actualizar(Integer id, RecetaRequest request) {
        Receta existente = obtenerEntidad(id);
        validarPropietario(existente);
        Receta actualizada = mapper.toEntity(request);
        actualizada.setIdReceta(existente.getIdReceta());
        actualizada.setConsulta(obtenerConsultaVerificada(request.idConsulta()));
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        Receta entidad = obtenerEntidad(id);
        validarPropietario(entidad);
        repository.delete(entidad);
    }

    private Consulta obtenerConsultaVerificada(Integer idConsulta) {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada: " + idConsulta));
        if (contexto.esDoctor() && !consulta.getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tenés acceso a esta consulta");
        }
        return consulta;
    }

    private void validarPropietario(Receta entidad) {
        if (contexto.esDoctor()
                && !entidad.getConsulta().getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tenés acceso a esta receta");
        }
    }

    private Receta obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Receta no encontrada: " + id));
    }
}
