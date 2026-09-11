package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CambiarPasswordRequest;
import com.ferancheta.odonto_sys.dto.response.PerfilResponse;
import com.ferancheta.odonto_sys.entity.Usuario;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final ContextoAutenticacion contexto;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PerfilResponse obtenerPerfil() {
        Usuario usuario = contexto.usuarioActual();
        return new PerfilResponse(
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getUsername(),
                usuario.getEstado(),
                usuario.getRol().getNombre());
    }

    @Transactional
    public void cambiarPassword(CambiarPasswordRequest request) {
        Usuario usuario = contexto.usuarioActual();
        if (!passwordEncoder.matches(request.passwordActual(), usuario.getPasswordHash())) {
            throw new IllegalArgumentException("La contraseña actual no es correcta");
        }
        usuario.setPasswordHash(passwordEncoder.encode(request.passwordNueva()));
        usuarioRepository.save(usuario);
    }
}
