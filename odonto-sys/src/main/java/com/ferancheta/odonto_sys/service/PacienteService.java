package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.PacienteRequest;
import com.ferancheta.odonto_sys.dto.response.PacienteResponse;
import com.ferancheta.odonto_sys.entity.CatGenero;
import com.ferancheta.odonto_sys.entity.CatProfesion;
import com.ferancheta.odonto_sys.entity.Municipio;
import com.ferancheta.odonto_sys.entity.Paciente;
import com.ferancheta.odonto_sys.mapper.PacienteMapper;
import com.ferancheta.odonto_sys.repository.CatGeneroRepository;
import com.ferancheta.odonto_sys.repository.CatProfesionRepository;
import com.ferancheta.odonto_sys.repository.MunicipioRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final CatGeneroRepository catGeneroRepository;
    private final CatProfesionRepository catProfesionRepository;
    private final MunicipioRepository municipioRepository;
    private final PacienteMapper mapper;

    @Transactional(readOnly = true)
    public List<PacienteResponse> listar() {
        return pacienteRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PacienteResponse> listarActivos() {
        return pacienteRepository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PacienteResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public PacienteResponse crear(PacienteRequest request) {
        Paciente paciente = mapper.toEntity(request);
        paciente.setActivo(true);
        aplicarRelaciones(paciente, request);
        return mapper.toResponse(pacienteRepository.save(paciente));
    }

    @Transactional
    public PacienteResponse actualizar(Integer id, PacienteRequest request) {
        Paciente existente = obtenerEntidad(id);
        Paciente actualizado = mapper.toEntity(request);
        actualizado.setIdPaciente(existente.getIdPaciente());
        actualizado.setActivo(existente.getActivo());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(pacienteRepository.save(actualizado));
    }

    /**
     * Los pacientes no se eliminan físicamente por el historial clínico asociado; se desactivan.
     */
    @Transactional
    public void eliminar(Integer id) {
        Paciente paciente = obtenerEntidad(id);
        paciente.setActivo(false);
        pacienteRepository.save(paciente);
    }

    private void aplicarRelaciones(Paciente paciente, PacienteRequest request) {
        if (request.idGenero() != null) {
            CatGenero genero = catGeneroRepository.findById(request.idGenero())
                    .orElseThrow(() -> new EntityNotFoundException("Género no encontrado: " + request.idGenero()));
            paciente.setGenero(genero);
        } else {
            paciente.setGenero(null);
        }

        if (request.idProfesion() != null) {
            CatProfesion profesion = catProfesionRepository.findById(request.idProfesion())
                    .orElseThrow(() -> new EntityNotFoundException("Profesión no encontrada: " + request.idProfesion()));
            paciente.setProfesion(profesion);
        } else {
            paciente.setProfesion(null);
        }

        if (request.idMunicipio() != null) {
            Municipio municipio = municipioRepository.findById(request.idMunicipio())
                    .orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado: " + request.idMunicipio()));
            paciente.setMunicipio(municipio);
        } else {
            paciente.setMunicipio(null);
        }
    }

    private Paciente obtenerEntidad(Integer id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + id));
    }
}
