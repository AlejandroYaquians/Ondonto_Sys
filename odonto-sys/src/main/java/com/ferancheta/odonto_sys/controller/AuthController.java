package com.ferancheta.odonto_sys.controller;

import com.ferancheta.odonto_sys.dto.request.LoginRequest;
import com.ferancheta.odonto_sys.dto.response.LoginResponse;
import com.ferancheta.odonto_sys.entity.Usuario;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import com.ferancheta.odonto_sys.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final int MAXIMO_INTENTOS_FALLIDOS = 5;
    private static final long MINUTOS_BLOQUEO = 15;

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByUsername(request.username())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + request.username()));

        liberarBloqueoSiExpiro(usuario);

        if (usuario.getBloqueadoHasta() != null) {
            long minutosRestantes = Duration.between(LocalDateTime.now(), usuario.getBloqueadoHasta()).toMinutes() + 1;
            throw new LockedException("Cuenta bloqueada por demasiados intentos fallidos. Intente de nuevo en "
                    + minutosRestantes + " minuto(s).");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
        } catch (BadCredentialsException ex) {
            registrarIntentoFallido(usuario);
            throw ex;
        }

        registrarIntentoExitoso(usuario);

        String token = jwtService.generateToken(usuario);

        return ResponseEntity.ok(new LoginResponse(
                token, usuario.getIdUsuario(), usuario.getNombre(), usuario.getApellido(),
                usuario.getUsername(), usuario.getRol().getNombre()));
    }

    private void liberarBloqueoSiExpiro(Usuario usuario) {
        if (usuario.getBloqueadoHasta() != null && !usuario.getBloqueadoHasta().isAfter(LocalDateTime.now())) {
            usuario.setIntentosFallidos(0);
            usuario.setBloqueadoHasta(null);
            usuarioRepository.save(usuario);
        }
    }

    private void registrarIntentoFallido(Usuario usuario) {
        int intentos = usuario.getIntentosFallidos() + 1;
        usuario.setIntentosFallidos(intentos);
        if (intentos >= MAXIMO_INTENTOS_FALLIDOS) {
            usuario.setBloqueadoHasta(LocalDateTime.now().plusMinutes(MINUTOS_BLOQUEO));
        }
        usuarioRepository.save(usuario);
    }

    private void registrarIntentoExitoso(Usuario usuario) {
        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);
        usuarioRepository.save(usuario);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<String> handleLockedException(LockedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }
}
