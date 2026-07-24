package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.HistorialMedicoRequest;
import com.ferancheta.odonto_sys.dto.response.HistorialMedicoResponse;
import com.ferancheta.odonto_sys.entity.HistorialMedico;
import com.ferancheta.odonto_sys.mapper.HistorialMedicoMapper;
import com.ferancheta.odonto_sys.repository.CatAfeccionRepository;
import com.ferancheta.odonto_sys.repository.HistorialMedicoRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialMedicoService {

    private final HistorialMedicoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final CatAfeccionRepository catAfeccionRepository;
    private final HistorialMedicoMapper mapper;

    @Transactional(readOnly = true)
    public List<HistorialMedicoResponse> listarPorPaciente(Integer idPaciente) {
        return repository.findByPaciente_IdPaciente(idPaciente).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public HistorialMedicoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public HistorialMedicoResponse crear(HistorialMedicoRequest request) {
        HistorialMedico entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public HistorialMedicoResponse actualizar(Integer id, HistorialMedicoRequest request) {
        HistorialMedico existente = obtenerEntidad(id);
        HistorialMedico actualizado = mapper.toEntity(request);
        actualizado.setIdHistorial(existente.getIdHistorial());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(HistorialMedico entidad, HistorialMedicoRequest request) {
        entidad.setPaciente(pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente())));
        entidad.setAfeccion(catAfeccionRepository.findById(request.idAfeccion())
                .orElseThrow(() -> new EntityNotFoundException("Afección no encontrada: " + request.idAfeccion())));
    }

    private HistorialMedico obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Historial médico no encontrado: " + id));
    }
}
