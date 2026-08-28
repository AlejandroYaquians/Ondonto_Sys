package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.GastoRequest;
import com.ferancheta.odonto_sys.dto.response.GastoResponse;
import com.ferancheta.odonto_sys.entity.Gasto;
import com.ferancheta.odonto_sys.mapper.GastoMapper;
import com.ferancheta.odonto_sys.repository.CatGastoRepository;
import com.ferancheta.odonto_sys.repository.GastoRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GastoService {

    private final GastoRepository repository;
    private final CatGastoRepository catGastoRepository;
    private final ContextoAutenticacion contexto;
    private final GastoMapper mapper;

    @Transactional(readOnly = true)
    public List<GastoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<GastoResponse> listarPorRangoFecha(LocalDate desde, LocalDate hasta, Integer idTipoGasto) {
        return repository.findByFechaBetween(desde, hasta).stream()
                .filter(g -> idTipoGasto == null || g.getTipoGasto().getIdTipoGasto().equals(idTipoGasto))
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public GastoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public GastoResponse crear(GastoRequest request) {
        Gasto entidad = mapper.toEntity(request);
        entidad.setUsuario(contexto.usuarioActual());
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public GastoResponse actualizar(Integer id, GastoRequest request) {
        Gasto existente = obtenerEntidad(id);
        Gasto actualizado = mapper.toEntity(request);
        actualizado.setIdGasto(existente.getIdGasto());
        actualizado.setUsuario(existente.getUsuario());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(Gasto entidad, GastoRequest request) {
        entidad.setTipoGasto(catGastoRepository.findById(request.idTipoGasto())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de gasto no encontrado: " + request.idTipoGasto())));
    }

    private Gasto obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + id));
    }
}
