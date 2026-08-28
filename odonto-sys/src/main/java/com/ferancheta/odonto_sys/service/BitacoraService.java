package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.BitacoraResponse;
import com.ferancheta.odonto_sys.entity.Bitacora;
import com.ferancheta.odonto_sys.mapper.BitacoraMapper;
import com.ferancheta.odonto_sys.repository.BitacoraRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import tools.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BitacoraService {

    private static final Logger log = LoggerFactory.getLogger(BitacoraService.class);
    private static final LocalDateTime FECHA_MINIMA = LocalDateTime.of(2000, 1, 1, 0, 0);
    private static final LocalDateTime FECHA_MAXIMA = LocalDateTime.of(2100, 1, 1, 0, 0);

    private final BitacoraRepository repository;
    private final ContextoAutenticacion contexto;
    private final ObjectMapper objectMapper;
    private final HttpServletRequest request;
    private final BitacoraMapper mapper;

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public Page<BitacoraResponse> listar(Integer idUsuario, String tablaAfectada,
                                          LocalDateTime desde, LocalDateTime hasta, Pageable pageable) {
        LocalDateTime desdeFecha = desde != null ? desde : FECHA_MINIMA;
        LocalDateTime hastaFecha = hasta != null ? hasta : FECHA_MAXIMA;

        List<Bitacora> filtrados = repository.findByFechaHoraBetweenOrderByFechaHoraDesc(desdeFecha, hastaFecha).stream()
                .filter(b -> idUsuario == null || (b.getUsuario() != null && idUsuario.equals(b.getUsuario().getIdUsuario())))
                .filter(b -> tablaAfectada == null || tablaAfectada.equals(b.getTablaAfectada()))
                .toList();

        int inicio = Math.min((int) pageable.getOffset(), filtrados.size());
        int fin = Math.min(inicio + pageable.getPageSize(), filtrados.size());

        return new PageImpl<>(filtrados.subList(inicio, fin), pageable, filtrados.size()).map(mapper::toResponse);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public BitacoraResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public void registrarCambio(String tablaAfectada, Integer idRegistro, String accion, Object antes, Object despues) {
        try {
            registrarCambioInterno(tablaAfectada, idRegistro, accion, antes, despues);
        } catch (Exception e) {
            log.error("No se pudo registrar en bitácora ({} {} #{}): {}", accion, tablaAfectada, idRegistro, e.getMessage());
        }
    }

    private void registrarCambioInterno(String tablaAfectada, Integer idRegistro, String accion, Object antes, Object despues) {
        Map<String, Object> mapaAntes = antes != null ? objectMapper.convertValue(antes, Map.class) : Map.of();
        Map<String, Object> mapaDespues = despues != null ? objectMapper.convertValue(despues, Map.class) : Map.of();

        Set<String> campos = new LinkedHashSet<>();
        campos.addAll(mapaAntes.keySet());
        campos.addAll(mapaDespues.keySet());

        Map<String, Object> camposAntes = new java.util.LinkedHashMap<>();
        Map<String, Object> camposDespues = new java.util.LinkedHashMap<>();
        for (String campo : campos) {
            Object valorAntes = mapaAntes.get(campo);
            Object valorDespues = mapaDespues.get(campo);
            if (Objects.equals(valorAntes, valorDespues)) {
                continue;
            }
            camposAntes.put(campo, valorAntes);
            camposDespues.put(campo, valorDespues);
        }

        if (camposAntes.isEmpty()) {
            return;
        }

        Bitacora entidad = new Bitacora();
        entidad.setTablaAfectada(tablaAfectada);
        entidad.setIdRegistro(idRegistro);
        entidad.setAccion(accion);
        entidad.setValorAnterior(antes != null ? objectMapper.writeValueAsString(camposAntes) : null);
        entidad.setValorNuevo(despues != null ? objectMapper.writeValueAsString(camposDespues) : null);
        entidad.setIpOrigen(obtenerIp());

        Integer idUsuarioActual = obtenerIdUsuarioActual();
        if (idUsuarioActual != null) {
            entidad.setUsuario(contexto.usuarioActual());
        }
        repository.save(entidad);
    }

    private Integer obtenerIdUsuarioActual() {
        try {
            return contexto.usuarioActual().getIdUsuario();
        } catch (Exception e) {
            return null;
        }
    }

    private String obtenerIp() {
        String reenviada = request.getHeader("X-Forwarded-For");
        if (reenviada != null && !reenviada.isBlank()) {
            return reenviada.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private Bitacora obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Registro de bitácora no encontrado: " + id));
    }
}
