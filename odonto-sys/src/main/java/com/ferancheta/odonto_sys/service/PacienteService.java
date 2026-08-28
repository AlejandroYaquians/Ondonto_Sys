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
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
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
    private final ContextoAutenticacion contexto;
    private final BitacoraService bitacoraService;
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
    public List<PacienteResponse> buscarActivos(String busqueda) {
        return pacienteRepository
                .findByActivoTrueAndNombreContainingIgnoreCaseOrActivoTrueAndApellidoContainingIgnoreCase(busqueda, busqueda)
                .stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PacienteResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public PacienteResponse crear(PacienteRequest request) {
        Paciente paciente = mapper.toEntity(request);
        paciente.setActivo(true);
        paciente.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(paciente, request);
        PacienteResponse resultado = mapper.toResponse(pacienteRepository.save(paciente));
        bitacoraService.registrarCambio("paciente", resultado.idPaciente(), "INSERT", null, resultado);
        return resultado;
    }

    @Transactional
    public PacienteResponse actualizar(Integer id, PacienteRequest request) {
        Paciente existente = obtenerEntidad(id);
        PacienteResponse antes = mapper.toResponse(existente);
        Paciente actualizado = mapper.toEntity(request);
        actualizado.setIdPaciente(existente.getIdPaciente());
        actualizado.setActivo(existente.getActivo());
        actualizado.setIdUsuarioCreacion(existente.getIdUsuarioCreacion());
        actualizado.setIdUsuarioModificacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(actualizado, request);
        PacienteResponse despues = mapper.toResponse(pacienteRepository.save(actualizado));
        bitacoraService.registrarCambio("paciente", id, "UPDATE", antes, despues);
        return despues;
    }


    @Transactional
    public void eliminar(Integer id) {
        Paciente paciente = obtenerEntidad(id);
        PacienteResponse antes = mapper.toResponse(paciente);
        paciente.setActivo(false);
        PacienteResponse despues = mapper.toResponse(pacienteRepository.save(paciente));
        bitacoraService.registrarCambio("paciente", id, "DELETE", antes, despues);
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
