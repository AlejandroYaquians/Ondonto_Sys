package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.InsumoMovimientoRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoMovimientoResponse;
import com.ferancheta.odonto_sys.entity.CatMovimiento;
import com.ferancheta.odonto_sys.entity.Insumo;
import com.ferancheta.odonto_sys.entity.InsumoMovimiento;
import com.ferancheta.odonto_sys.mapper.InsumoMovimientoMapper;
import com.ferancheta.odonto_sys.repository.CatMovimientoRepository;
import com.ferancheta.odonto_sys.repository.GastoRepository;
import com.ferancheta.odonto_sys.repository.InsumoMovimientoRepository;
import com.ferancheta.odonto_sys.repository.InsumoRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InsumoMovimientoService {

    private final InsumoMovimientoRepository repository;
    private final InsumoRepository insumoRepository;
    private final CatMovimientoRepository catMovimientoRepository;
    private final GastoRepository gastoRepository;
    private final UsuarioRepository usuarioRepository;
    private final InsumoMovimientoMapper mapper;

    @Transactional(readOnly = true)
    public List<InsumoMovimientoResponse> listarPorInsumo(Integer idInsumo) {
        return repository.findByInsumo_IdInsumo(idInsumo).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InsumoMovimientoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public InsumoMovimientoResponse crear(InsumoMovimientoRequest request) {
        InsumoMovimiento entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        ajustarStock(entidad.getInsumo(), entidad.getTipoMovimiento(), entidad.getCantidad());
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public void eliminar(Integer id) {
        InsumoMovimiento entidad = obtenerEntidad(id);
        revertirStock(entidad.getInsumo(), entidad.getTipoMovimiento(), entidad.getCantidad());
        repository.delete(entidad);
    }

    private void ajustarStock(Insumo insumo, CatMovimiento tipoMovimiento, Integer cantidad) {
        int stockActual = insumo.getStockActual() != null ? insumo.getStockActual() : 0;
        int nuevoStock = Boolean.TRUE.equals(tipoMovimiento.getOperacion())
                ? stockActual + cantidad
                : stockActual - cantidad;
        insumo.setStockActual(nuevoStock);
        insumoRepository.save(insumo);
    }

    private void revertirStock(Insumo insumo, CatMovimiento tipoMovimiento, Integer cantidad) {
        int stockActual = insumo.getStockActual() != null ? insumo.getStockActual() : 0;
        int nuevoStock = Boolean.TRUE.equals(tipoMovimiento.getOperacion())
                ? stockActual - cantidad
                : stockActual + cantidad;
        insumo.setStockActual(nuevoStock);
        insumoRepository.save(insumo);
    }

    private void aplicarRelaciones(InsumoMovimiento entidad, InsumoMovimientoRequest request) {
        entidad.setInsumo(insumoRepository.findById(request.idInsumo())
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado: " + request.idInsumo())));
        entidad.setTipoMovimiento(catMovimientoRepository.findById(request.idTipoMovimiento())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de movimiento no encontrado: " + request.idTipoMovimiento())));
        entidad.setUsuario(usuarioRepository.findById(request.idUsuario())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuario())));

        if (request.idGasto() != null) {
            entidad.setGasto(gastoRepository.findById(request.idGasto())
                    .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + request.idGasto())));
        } else {
            entidad.setGasto(null);
        }
    }

    private InsumoMovimiento obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movimiento de insumo no encontrado: " + id));
    }
}
