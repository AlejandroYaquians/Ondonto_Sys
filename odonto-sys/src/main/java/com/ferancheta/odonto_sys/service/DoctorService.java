package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.DoctorRequest;
import com.ferancheta.odonto_sys.dto.response.DoctorResponse;
import com.ferancheta.odonto_sys.entity.CatEspecialidad;
import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.mapper.DoctorMapper;
import com.ferancheta.odonto_sys.repository.CatEspecialidadRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final CatEspecialidadRepository catEspecialidadRepository;
    private final ContextoAutenticacion contexto;
    private final BitacoraService bitacoraService;
    private final DoctorMapper mapper;

    @Transactional(readOnly = true)
    public List<DoctorResponse> listar() {
        return doctorRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> listarActivos() {
        return doctorRepository.findByActivoTrue().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DoctorResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public DoctorResponse crear(DoctorRequest request) {
        Doctor doctor = mapper.toEntity(request);
        doctor.setActivo(true);
        doctor.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(doctor, request);
        DoctorResponse resultado = mapper.toResponse(doctorRepository.save(doctor));
        bitacoraService.registrarCambio("doctor", resultado.idDoctor(), "INSERT", null, resultado);
        return resultado;
    }

    @Transactional
    public DoctorResponse actualizar(Integer id, DoctorRequest request) {
        Doctor existente = obtenerEntidad(id);
        DoctorResponse antes = mapper.toResponse(existente);
        Doctor actualizado = mapper.toEntity(request);
        actualizado.setIdDoctor(existente.getIdDoctor());
        actualizado.setActivo(existente.getActivo());
        actualizado.setUsuario(existente.getUsuario());
        actualizado.setIdUsuarioCreacion(existente.getIdUsuarioCreacion());
        actualizado.setIdUsuarioModificacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(actualizado, request);
        DoctorResponse despues = mapper.toResponse(doctorRepository.save(actualizado));
        bitacoraService.registrarCambio("doctor", id, "UPDATE", antes, despues);
        return despues;
    }

    @Transactional
    public void eliminar(Integer id) {
        Doctor doctor = obtenerEntidad(id);
        DoctorResponse antes = mapper.toResponse(doctor);
        doctor.setActivo(false);
        DoctorResponse despues = mapper.toResponse(doctorRepository.save(doctor));
        bitacoraService.registrarCambio("doctor", id, "DELETE", antes, despues);
    }

    private void aplicarRelaciones(Doctor doctor, DoctorRequest request) {
        if (request.idsEspecialidad() != null && !request.idsEspecialidad().isEmpty()) {
            List<CatEspecialidad> especialidades = request.idsEspecialidad().stream()
                    .map(id -> catEspecialidadRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("Especialidad no encontrada: " + id)))
                    .toList();
            doctor.setEspecialidades(new ArrayList<>(especialidades));
        } else {
            doctor.setEspecialidades(new ArrayList<>());
        }
    }

    private Doctor obtenerEntidad(Integer id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + id));
    }
}
