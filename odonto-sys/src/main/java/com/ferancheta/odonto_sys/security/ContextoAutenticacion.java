package com.ferancheta.odonto_sys.security;

import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.entity.Usuario;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class ContextoAutenticacion {

    private static final String ROL_DOCTOR = "DOCTOR";

    private final DoctorRepository doctorRepository;

    public Usuario usuarioActual() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public boolean esDoctor() {
        return ROL_DOCTOR.equals(usuarioActual().getRol().getNombre());
    }

    public Doctor doctorActual() {
        return doctorRepository.findByUsuario_IdUsuario(usuarioActual().getIdUsuario())
                .orElseThrow(() -> new IllegalStateException(
                        "El usuario autenticado tiene rol DOCTOR pero no tiene un registro de doctor asociado"));
    }
}
