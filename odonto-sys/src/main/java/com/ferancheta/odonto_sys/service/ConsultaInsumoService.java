package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ConsultaInsumoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaInsumoResponse;
import com.ferancheta.odonto_sys.entity.ConsultaInsumo;
import com.ferancheta.odonto_sys.mapper.ConsultaInsumoMapper;
import com.ferancheta.odonto_sys.repository.ConsultaInsumoRepository;
import com.ferancheta.odonto_sys.repository.ConsultaTratamientoRepository;
import com.ferancheta.odonto_sys.repository.InsumoRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * El stock_actual del insumo NO se toca acá: lo maneja un trigger de PostgreSQL en la
 * tabla consulta_insumo (AFTER INSERT resta, AFTER DELETE restaura). Por eso este registro
 * es de solo crear/borrar — no existe actualizar(): si hay un error, se borra (el trigger
 * restaura el stock) y se crea uno nuevo, en vez de editar la cantidad o el insumo in situ.
 */
@Service
@RequiredArgsConstructor
public class ConsultaInsumoService {

    private final ConsultaInsumoRepository repository;
    private final ConsultaTratamientoRepository consultaTratamientoRepository;
    private final InsumoRepository insumoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConsultaInsumoMapper mapper;

    @Transactional(readOnly = true)
    public List<ConsultaInsumoResponse> listarPorConsultaTratamiento(Integer idConsultaTratamiento) {
        return repository.findByConsultaTratamiento_IdConsultaTratamiento(idConsultaTratamiento)
                .stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaInsumoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ConsultaInsumoResponse crear(ConsultaInsumoRequest request) {
        ConsultaInsumo entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(ConsultaInsumo entidad, ConsultaInsumoRequest request) {
        entidad.setConsultaTratamiento(consultaTratamientoRepository.findById(request.idConsultaTratamiento())
                .orElseThrow(() -> new EntityNotFoundException("Consulta tratamiento no encontrada: " + request.idConsultaTratamiento())));
        entidad.setInsumo(insumoRepository.findById(request.idInsumo())
                .orElseThrow(() -> new EntityNotFoundException("Insumo no encontrado: " + request.idInsumo())));
        entidad.setUsuarioCreacion(usuarioRepository.findById(request.idUsuarioCreacion())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuarioCreacion())));
    }

    private ConsultaInsumo obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta insumo no encontrada: " + id));
    }
}
