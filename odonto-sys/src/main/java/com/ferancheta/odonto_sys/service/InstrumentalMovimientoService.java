package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.InstrumentalMovimientoRequest;
import com.ferancheta.odonto_sys.dto.response.InstrumentalMovimientoResponse;
import com.ferancheta.odonto_sys.entity.CatMovimiento;
import com.ferancheta.odonto_sys.entity.Instrumental;
import com.ferancheta.odonto_sys.entity.InstrumentalMovimiento;
import com.ferancheta.odonto_sys.mapper.InstrumentalMovimientoMapper;
import com.ferancheta.odonto_sys.repository.CatMovimientoRepository;
import com.ferancheta.odonto_sys.repository.InstrumentalMovimientoRepository;
import com.ferancheta.odonto_sys.repository.InstrumentalRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstrumentalMovimientoService {

    private static final String TIPO_USO_EN_CONSULTA = "Uso en consulta";

    private final InstrumentalMovimientoRepository repository;
    private final InstrumentalRepository instrumentalRepository;
    private final CatMovimientoRepository catMovimientoRepository;
    private final ContextoAutenticacion contexto;
    private final InstrumentalMovimientoMapper mapper;

    @Transactional(readOnly = true)
    public List<InstrumentalMovimientoResponse> listarPorInstrumental(Integer idInstrumental) {
        return repository.findByInstrumental_IdInstrumental(idInstrumental).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InstrumentalMovimientoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public InstrumentalMovimientoResponse crear(InstrumentalMovimientoRequest request) {
        InstrumentalMovimiento entidad = mapper.toEntity(request);
        entidad.setUsuario(contexto.usuarioActual());
        aplicarRelaciones(entidad, request);
        validarAccesoPorRol(entidad.getTipoMovimiento());
        ajustarStock(entidad.getInstrumental(), entidad.getTipoMovimiento(), entidad.getCantidad());
        return mapper.toResponse(repository.save(entidad));
    }

    private void validarAccesoPorRol(CatMovimiento tipoMovimiento) {
        if (contexto.esDoctor() && !TIPO_USO_EN_CONSULTA.equals(tipoMovimiento.getNombreMovimiento())) {
            throw new AccessDeniedException("Los doctores solo pueden registrar uso en consulta");
        }
    }

    @Transactional
    public void eliminar(Integer id) {
        InstrumentalMovimiento entidad = obtenerEntidad(id);
        revertirStock(entidad.getInstrumental(), entidad.getTipoMovimiento(), entidad.getCantidad());
        repository.delete(entidad);
    }

    private void ajustarStock(Instrumental instrumental, CatMovimiento tipoMovimiento, Integer cantidad) {
        int stockActual = instrumental.getStockActual() != null ? instrumental.getStockActual() : 0;
        boolean suma = Boolean.TRUE.equals(tipoMovimiento.getOperacion());
        if (!suma && cantidad > stockActual) {
            throw new IllegalStateException("El stock actual no es suficiente para este movimiento");
        }
        int nuevoStock = suma ? stockActual + cantidad : stockActual - cantidad;
        instrumental.setStockActual(nuevoStock);
        instrumentalRepository.save(instrumental);
    }

    private void revertirStock(Instrumental instrumental, CatMovimiento tipoMovimiento, Integer cantidad) {
        int stockActual = instrumental.getStockActual() != null ? instrumental.getStockActual() : 0;
        int nuevoStock = Boolean.TRUE.equals(tipoMovimiento.getOperacion())
                ? stockActual - cantidad
                : stockActual + cantidad;
        instrumental.setStockActual(nuevoStock);
        instrumentalRepository.save(instrumental);
    }

    private void aplicarRelaciones(InstrumentalMovimiento entidad, InstrumentalMovimientoRequest request) {
        entidad.setInstrumental(instrumentalRepository.findById(request.idInstrumental())
                .orElseThrow(() -> new EntityNotFoundException("Instrumental no encontrado: " + request.idInstrumental())));
        entidad.setTipoMovimiento(catMovimientoRepository.findById(request.idTipoMovimiento())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de movimiento no encontrado: " + request.idTipoMovimiento())));
    }

    private InstrumentalMovimiento obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movimiento de instrumental no encontrado: " + id));
    }
}
