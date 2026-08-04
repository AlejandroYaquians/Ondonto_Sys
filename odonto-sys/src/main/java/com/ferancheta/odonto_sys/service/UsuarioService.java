package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.UsuarioRequest;
import com.ferancheta.odonto_sys.dto.response.UsuarioResponse;
import com.ferancheta.odonto_sys.entity.CatEspecialidad;
import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.entity.Rol;
import com.ferancheta.odonto_sys.entity.Usuario;
import com.ferancheta.odonto_sys.mapper.UsuarioMapper;
import com.ferancheta.odonto_sys.repository.CatEspecialidadRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.RolRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Al crear un Usuario con rol DOCTOR, además del registro en usuario se crea
 * automáticamente el registro correspondiente en doctor (regla de negocio del proyecto).
 */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private static final String ROL_DOCTOR = "DOCTOR";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final DoctorRepository doctorRepository;
    private final CatEspecialidadRepository catEspecialidadRepository;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponse crear(UsuarioRequest request) {
        Rol rol = obtenerRol(request.idRol());

        Usuario usuario = mapper.toEntity(request);
        usuario.setEstado(true);
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setRol(rol);
        Usuario guardado = usuarioRepository.save(usuario);

        if (ROL_DOCTOR.equals(rol.getNombre())) {
            crearDoctorParaUsuario(guardado, request);
        }

        return mapper.toResponse(guardado);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponse actualizar(Integer id, UsuarioRequest request) {
        Usuario existente = obtenerEntidad(id);
        Usuario actualizado = mapper.toEntity(request);
        actualizado.setIdUsuario(existente.getIdUsuario());
        actualizado.setEstado(existente.getEstado());
        actualizado.setPasswordHash(passwordEncoder.encode(request.password()));
        actualizado.setRol(obtenerRol(request.idRol()));
        return mapper.toResponse(usuarioRepository.save(actualizado));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponse cambiarEstado(Integer id, boolean estado) {
        Usuario usuario = obtenerEntidad(id);
        usuario.setEstado(estado);
        return mapper.toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        usuarioRepository.delete(obtenerEntidad(id));
    }

    private void crearDoctorParaUsuario(Usuario usuario, UsuarioRequest request) {
        if (request.apellido() == null || request.apellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio para crear un usuario con rol DOCTOR");
        }
        if (request.porcentajeComision() == null) {
            throw new IllegalArgumentException("El porcentaje de comisión es obligatorio para crear un usuario con rol DOCTOR");
        }

        Doctor doctor = Doctor.builder()
                .nombre(usuario.getNombre())
                .apellido(request.apellido())
                .porcentajeComision(request.porcentajeComision())
                .activo(true)
                .usuario(usuario)
                .build();

        if (request.idEspecialidad() != null) {
            CatEspecialidad especialidad = catEspecialidadRepository.findById(request.idEspecialidad())
                    .orElseThrow(() -> new EntityNotFoundException("Especialidad no encontrada: " + request.idEspecialidad()));
            doctor.setEspecialidad(especialidad);
        }

        doctorRepository.save(doctor);
    }

    private Usuario obtenerEntidad(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + id));
    }

    private Rol obtenerRol(Integer idRol) {
        return rolRepository.findById(idRol)
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado: " + idRol));
    }
}
