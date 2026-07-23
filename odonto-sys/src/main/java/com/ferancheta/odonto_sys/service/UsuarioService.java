package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.UsuarioRequest;
import com.ferancheta.odonto_sys.dto.response.UsuarioResponse;
import com.ferancheta.odonto_sys.entity.Rol;
import com.ferancheta.odonto_sys.entity.Usuario;
import com.ferancheta.odonto_sys.mapper.UsuarioMapper;
import com.ferancheta.odonto_sys.repository.RolRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
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
    public UsuarioResponse crear(UsuarioRequest request) {
        Usuario usuario = mapper.toEntity(request);
        usuario.setEstado(true);
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setRol(obtenerRol(request.idRol()));
        return mapper.toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
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
    public UsuarioResponse cambiarEstado(Integer id, boolean estado) {
        Usuario usuario = obtenerEntidad(id);
        usuario.setEstado(estado);
        return mapper.toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminar(Integer id) {
        usuarioRepository.delete(obtenerEntidad(id));
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
