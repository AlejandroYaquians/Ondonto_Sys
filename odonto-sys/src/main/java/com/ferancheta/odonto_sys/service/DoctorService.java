package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.DoctorRequest;
import com.ferancheta.odonto_sys.dto.response.DoctorResponse;
import com.ferancheta.odonto_sys.entity.CatEspecialidad;
import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.entity.Usuario;
import com.ferancheta.odonto_sys.mapper.DoctorMapper;
import com.ferancheta.odonto_sys.repository.CatEspecialidadRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final CatEspecialidadRepository catEspecialidadRepository;
    private final UsuarioRepository usuarioRepository;
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
        aplicarRelaciones(doctor, request);
        return mapper.toResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public DoctorResponse actualizar(Integer id, DoctorRequest request) {
        Doctor existente = obtenerEntidad(id);
        Doctor actualizado = mapper.toEntity(request);
        actualizado.setIdDoctor(existente.getIdDoctor());
        actualizado.setActivo(existente.getActivo());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(doctorRepository.save(actualizado));
    }

    /**
     * Los doctores no se eliminan físicamente porque quedan referenciados desde citas,
     * consultas y comisiones históricas; se desactivan.
     */
    @Transactional
    public void eliminar(Integer id) {
        Doctor doctor = obtenerEntidad(id);
        doctor.setActivo(false);
        doctorRepository.save(doctor);
    }

    private void aplicarRelaciones(Doctor doctor, DoctorRequest request) {
        if (request.idEspecialidad() != null) {
            CatEspecialidad especialidad = catEspecialidadRepository.findById(request.idEspecialidad())
                    .orElseThrow(() -> new EntityNotFoundException("Especialidad no encontrada: " + request.idEspecialidad()));
            doctor.setEspecialidad(especialidad);
        } else {
            doctor.setEspecialidad(null);
        }

        if (request.idUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(request.idUsuario())
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuario()));
            doctor.setUsuario(usuario);
        } else {
            doctor.setUsuario(null);
        }
    }

    private Doctor obtenerEntidad(Integer id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + id));
    }
}
