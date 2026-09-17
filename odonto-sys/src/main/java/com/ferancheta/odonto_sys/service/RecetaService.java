package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.RecetaRequest;
import com.ferancheta.odonto_sys.dto.response.RecetaResponse;
import com.ferancheta.odonto_sys.entity.HistorialClinico;
import com.ferancheta.odonto_sys.entity.Receta;
import com.ferancheta.odonto_sys.mapper.RecetaMapper;
import com.ferancheta.odonto_sys.repository.HistorialClinicoRepository;
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
    private final HistorialClinicoRepository historialClinicoRepository;
    private final ContextoAutenticacion contexto;
    private final RecetaMapper mapper;

    @Transactional(readOnly = true)
    public List<RecetaResponse> listarPorHistorialClinico(Integer idHistorialClinico) {
        if (!historialClinicoRepository.existsById(idHistorialClinico)) {
            throw new EntityNotFoundException("Historial clínico no encontrado: " + idHistorialClinico);
        }
        return repository.findByHistorialClinico_IdHistorialClinico(idHistorialClinico).stream()
                .map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<RecetaResponse> listarPorPaciente(Integer idPaciente) {
        return repository.findByHistorialClinico_Paciente_IdPaciente(idPaciente).stream()
                .map(mapper::toResponse).toList();
    }

    @Transactional
    public RecetaResponse crear(RecetaRequest request) {
        Receta entidad = mapper.toEntity(request);
        entidad.setHistorialClinico(obtenerHistorialVerificado(request.idHistorialClinico()));
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public RecetaResponse actualizar(Integer id, RecetaRequest request) {
        Receta existente = obtenerEntidad(id);
        validarPropietario(existente);
        Receta actualizada = mapper.toEntity(request);
        actualizada.setIdReceta(existente.getIdReceta());
        actualizada.setHistorialClinico(obtenerHistorialVerificado(request.idHistorialClinico()));
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        Receta entidad = obtenerEntidad(id);
        validarPropietario(entidad);
        repository.delete(entidad);
    }

    private HistorialClinico obtenerHistorialVerificado(Integer idHistorialClinico) {
        HistorialClinico historial = historialClinicoRepository.findById(idHistorialClinico)
                .orElseThrow(() -> new EntityNotFoundException("Historial clínico no encontrado: " + idHistorialClinico));
        if (contexto.esDoctor() && !historial.getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tiene acceso a este historial clínico");
        }
        return historial;
    }

    private void validarPropietario(Receta entidad) {
        if (contexto.esDoctor()
                && !entidad.getHistorialClinico().getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tiene acceso a esta receta");
        }
    }

    private Receta obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Receta no encontrada: " + id));
    }
}
