package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.AntecedenteMedicoRequest;
import com.ferancheta.odonto_sys.dto.response.AntecedenteMedicoResponse;
import com.ferancheta.odonto_sys.entity.AntecedenteMedico;
import com.ferancheta.odonto_sys.mapper.AntecedenteMedicoMapper;
import com.ferancheta.odonto_sys.repository.CatAfeccionRepository;
import com.ferancheta.odonto_sys.repository.AntecedenteMedicoRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AntecedenteMedicoService {

    private final AntecedenteMedicoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final CatAfeccionRepository catAfeccionRepository;
    private final AntecedenteMedicoMapper mapper;

    @Transactional(readOnly = true)
    public List<AntecedenteMedicoResponse> listarPorPaciente(Integer idPaciente) {
        return repository.findByPaciente_IdPaciente(idPaciente).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public AntecedenteMedicoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public AntecedenteMedicoResponse crear(AntecedenteMedicoRequest request) {
        AntecedenteMedico entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public AntecedenteMedicoResponse actualizar(Integer id, AntecedenteMedicoRequest request) {
        AntecedenteMedico existente = obtenerEntidad(id);
        AntecedenteMedico actualizado = mapper.toEntity(request);
        actualizado.setIdAntecedente(existente.getIdAntecedente());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(AntecedenteMedico entidad, AntecedenteMedicoRequest request) {
        entidad.setPaciente(pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente())));
        entidad.setAfeccion(catAfeccionRepository.findById(request.idAfeccion())
                .orElseThrow(() -> new EntityNotFoundException("Afección no encontrada: " + request.idAfeccion())));
    }

    private AntecedenteMedico obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Antecedente médico no encontrado: " + id));
    }
}
