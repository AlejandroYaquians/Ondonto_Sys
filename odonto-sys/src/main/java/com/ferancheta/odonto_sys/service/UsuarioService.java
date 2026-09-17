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

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private static final String ROL_DOCTOR = "DOCTOR";
    private static final Pattern PATRON_PASSWORD = Pattern.compile("^(?=.*[A-Z])(?=.*\\d).{8,}$");

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final DoctorRepository doctorRepository;
    private final CatEspecialidadRepository catEspecialidadRepository;
    private final BitacoraService bitacoraService;
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
        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        validarPassword(request.password());

        Rol rol = obtenerRol(request.idRol());

        Usuario usuario = mapper.toEntity(request);
        usuario.setEstado(true);
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setRol(rol);
        Usuario guardado = usuarioRepository.save(usuario);

        if (ROL_DOCTOR.equals(rol.getNombre())) {
            crearDoctorParaUsuario(guardado, request);
        }

        UsuarioResponse resultado = mapper.toResponse(guardado);
        bitacoraService.registrarCambio("usuario", resultado.idUsuario(), "INSERT", null, resultado);
        return resultado;
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponse actualizar(Integer id, UsuarioRequest request) {
        Usuario existente = obtenerEntidad(id);
        UsuarioResponse antes = mapper.toResponse(existente);
        Usuario actualizado = mapper.toEntity(request);
        actualizado.setIdUsuario(existente.getIdUsuario());
        actualizado.setEstado(existente.getEstado());
        actualizado.setRol(obtenerRol(request.idRol()));

        if (request.password() != null && !request.password().isBlank()) {
            validarPassword(request.password());
            actualizado.setPasswordHash(passwordEncoder.encode(request.password()));
        } else {
            actualizado.setPasswordHash(existente.getPasswordHash());
        }
        UsuarioResponse despues = mapper.toResponse(usuarioRepository.save(actualizado));
        bitacoraService.registrarCambio("usuario", id, "UPDATE", antes, despues);
        return despues;
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponse cambiarEstado(Integer id, boolean estado) {
        Usuario usuario = obtenerEntidad(id);
        UsuarioResponse antes = mapper.toResponse(usuario);
        usuario.setEstado(estado);
        UsuarioResponse despues = mapper.toResponse(usuarioRepository.save(usuario));
        bitacoraService.registrarCambio("usuario", id, "UPDATE", antes, despues);
        return despues;
    }

    private void crearDoctorParaUsuario(Usuario usuario, UsuarioRequest request) {
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

        if (request.idsEspecialidad() != null && !request.idsEspecialidad().isEmpty()) {
            List<CatEspecialidad> especialidades = request.idsEspecialidad().stream()
                    .map(id -> catEspecialidadRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("Especialidad no encontrada: " + id)))
                    .toList();
            doctor.setEspecialidades(new ArrayList<>(especialidades));
        }

        doctorRepository.save(doctor);
    }

    private void validarPassword(String password) {
        if (!PATRON_PASSWORD.matcher(password).matches()) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número");
        }
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
