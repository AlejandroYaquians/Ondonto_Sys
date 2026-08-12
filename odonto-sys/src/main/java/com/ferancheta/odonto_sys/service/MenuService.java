package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.MenuRequest;
import com.ferancheta.odonto_sys.dto.response.MenuResponse;
import com.ferancheta.odonto_sys.dto.response.ModuloConMenusResponse;
import com.ferancheta.odonto_sys.entity.Menu;
import com.ferancheta.odonto_sys.entity.Modulo;
import com.ferancheta.odonto_sys.entity.Permiso;
import com.ferancheta.odonto_sys.mapper.MenuMapper;
import com.ferancheta.odonto_sys.repository.MenuRepository;
import com.ferancheta.odonto_sys.repository.ModuloRepository;
import com.ferancheta.odonto_sys.repository.PermisoRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository repository;
    private final ModuloRepository moduloRepository;
    private final PermisoRepository permisoRepository;
    private final ContextoAutenticacion contexto;
    private final MenuMapper mapper;

    @Transactional(readOnly = true)
    public List<MenuResponse> listarActivos() {
        return repository.findByActivoTrueOrderByOrden().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ModuloConMenusResponse> listarNavegacion() {
        Integer idRol = contexto.usuarioActual().getRol().getIdRol();

        Map<Modulo, List<Menu>> menusPorModulo = permisoRepository.findByRol_IdRol(idRol).stream()
                .filter(p -> Boolean.TRUE.equals(p.getPuedeVer()))
                .map(Permiso::getMenu)
                .filter(m -> Boolean.TRUE.equals(m.getActivo()))
                .distinct()
                .collect(Collectors.groupingBy(Menu::getModulo));

        return menusPorModulo.entrySet().stream()
                .map(entrada -> new ModuloConMenusResponse(
                        entrada.getKey().getIdModulo(),
                        entrada.getKey().getNombre(),
                        entrada.getValue().stream()
                                .sorted(Comparator.comparing(Menu::getOrden))
                                .map(mapper::toResponse)
                                .toList()))
                .sorted(Comparator.comparing(ModuloConMenusResponse::nombre))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> listarPorModulo(Integer idModulo) {
        return repository.findByModulo_IdModuloAndActivoTrueOrderByOrden(idModulo).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public MenuResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public MenuResponse crear(MenuRequest request) {
        Menu entidad = mapper.toEntity(request);
        entidad.setActivo(true);
        entidad.setModulo(obtenerModulo(request.idModulo()));
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public MenuResponse actualizar(Integer id, MenuRequest request) {
        Menu existente = obtenerEntidad(id);
        Menu actualizado = mapper.toEntity(request);
        actualizado.setIdMenu(existente.getIdMenu());
        actualizado.setActivo(existente.getActivo());
        actualizado.setModulo(obtenerModulo(request.idModulo()));
        return mapper.toResponse(repository.save(actualizado));
    }


    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(Integer id) {
        Menu menu = obtenerEntidad(id);
        menu.setActivo(false);
        repository.save(menu);
    }

    private Modulo obtenerModulo(Integer idModulo) {
        return moduloRepository.findById(idModulo)
                .orElseThrow(() -> new EntityNotFoundException("Módulo no encontrado: " + idModulo));
    }

    private Menu obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menú no encontrado: " + id));
    }
}
