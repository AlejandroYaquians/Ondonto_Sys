package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ConsultaTratamientoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaTratamientoResponse;
import com.ferancheta.odonto_sys.entity.ConsultaTratamiento;
import com.ferancheta.odonto_sys.mapper.ConsultaTratamientoMapper;
import com.ferancheta.odonto_sys.repository.CatTratamientoRepository;
import com.ferancheta.odonto_sys.repository.ConsultaRepository;
import com.ferancheta.odonto_sys.repository.ConsultaTratamientoRepository;
import com.ferancheta.odonto_sys.repository.ServicioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultaTratamientoService {

    private final ConsultaTratamientoRepository repository;
    private final ConsultaRepository consultaRepository;
    private final CatTratamientoRepository catTratamientoRepository;
    private final ServicioRepository servicioRepository;
    private final ConsultaTratamientoMapper mapper;

    @Transactional(readOnly = true)
    public List<ConsultaTratamientoResponse> listarPorConsulta(Integer idConsulta) {
        return repository.findByConsulta_IdConsulta(idConsulta).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaTratamientoResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ConsultaTratamientoResponse crear(ConsultaTratamientoRequest request) {
        ConsultaTratamiento entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public ConsultaTratamientoResponse actualizar(Integer id, ConsultaTratamientoRequest request) {
        ConsultaTratamiento existente = obtenerEntidad(id);
        ConsultaTratamiento actualizada = mapper.toEntity(request);
        actualizada.setIdConsultaTratamiento(existente.getIdConsultaTratamiento());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(ConsultaTratamiento entidad, ConsultaTratamientoRequest request) {
        entidad.setConsulta(consultaRepository.findById(request.idConsulta())
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada: " + request.idConsulta())));
        entidad.setTratamiento(catTratamientoRepository.findById(request.idTratamiento())
                .orElseThrow(() -> new EntityNotFoundException("Tratamiento no encontrado: " + request.idTratamiento())));

        if (request.idServicio() != null) {
            entidad.setServicio(servicioRepository.findById(request.idServicio())
                    .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado: " + request.idServicio())));
        } else {
            entidad.setServicio(null);
        }
    }

    private ConsultaTratamiento obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta tratamiento no encontrada: " + id));
    }
}
