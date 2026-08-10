package com.ferancheta.odonto_sys.security;

import com.ferancheta.odonto_sys.entity.Menu;
import com.ferancheta.odonto_sys.entity.Permiso;
import com.ferancheta.odonto_sys.entity.Usuario;
import com.ferancheta.odonto_sys.repository.MenuRepository;
import com.ferancheta.odonto_sys.repository.PermisoRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PermisoFilter extends OncePerRequestFilter {

    private final MenuRepository menuRepository;
    private final PermisoRepository permisoRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();

        if (path.startsWith("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getPrincipal()
                : null;

        if (!(principal instanceof Usuario usuario)) {
            filterChain.doFilter(request, response);
            return;
        }

        Optional<Menu> menuOpt = buscarMenuPorRuta(path);

        if (menuOpt.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        Menu menu = menuOpt.get();
        Permiso permiso = permisoRepository
                .findByRol_IdRolAndMenu_IdMenu(usuario.getRol().getIdRol(), menu.getIdMenu())
                .orElse(null);

        if (!tienePermiso(permiso, request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"mensaje\":\"No tiene permiso para esta acción\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private Optional<Menu> buscarMenuPorRuta(String path) {
        List<Menu> menus = menuRepository.findAll();
        return menus.stream()
                .filter(m -> m.getRuta() != null
                        && (path.equals(m.getRuta()) || path.startsWith(m.getRuta() + "/")))
                .max(Comparator.comparing(m -> m.getRuta().length()));
    }

    private boolean tienePermiso(Permiso permiso, String metodoHttp) {
        if (permiso == null) {
            return false;
        }
        return switch (metodoHttp) {
            case "GET" -> Boolean.TRUE.equals(permiso.getPuedeVer());
            case "POST" -> Boolean.TRUE.equals(permiso.getPuedeCrear());
            case "PUT", "PATCH" -> Boolean.TRUE.equals(permiso.getPuedeEditar());
            case "DELETE" -> Boolean.TRUE.equals(permiso.getPuedeEliminar());
            default -> false;
        };
    }
}
