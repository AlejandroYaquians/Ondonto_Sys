package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ConsultaTratamientoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaTratamientoResponse;
import com.ferancheta.odonto_sys.entity.Consulta;
import com.ferancheta.odonto_sys.entity.ConsultaTratamiento;
import com.ferancheta.odonto_sys.mapper.ConsultaTratamientoMapper;
import com.ferancheta.odonto_sys.repository.CatTratamientoRepository;
import com.ferancheta.odonto_sys.repository.ConsultaRepository;
import com.ferancheta.odonto_sys.repository.ConsultaTratamientoRepository;
import com.ferancheta.odonto_sys.repository.ServicioRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
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
    private final ContextoAutenticacion contexto;
    private final ConsultaTratamientoMapper mapper;

    @Transactional(readOnly = true)
    public List<ConsultaTratamientoResponse> listarPorConsulta(Integer idConsulta) {
        obtenerConsultaVerificada(idConsulta);
        return repository.findByConsulta_IdConsulta(idConsulta).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaTratamientoResponse buscarPorId(Integer id) {
        ConsultaTratamiento entidad = obtenerEntidad(id);
        validarPropietario(entidad);
        return mapper.toResponse(entidad);
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
        validarPropietario(existente);
        ConsultaTratamiento actualizada = mapper.toEntity(request);
        actualizada.setIdConsultaTratamiento(existente.getIdConsultaTratamiento());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public void eliminar(Integer id) {
        ConsultaTratamiento entidad = obtenerEntidad(id);
        validarPropietario(entidad);
        repository.delete(entidad);
    }

    private void aplicarRelaciones(ConsultaTratamiento entidad, ConsultaTratamientoRequest request) {
        entidad.setConsulta(obtenerConsultaVerificada(request.idConsulta()));
        entidad.setTratamiento(catTratamientoRepository.findById(request.idTratamiento())
                .orElseThrow(() -> new EntityNotFoundException("Tratamiento no encontrado: " + request.idTratamiento())));

        if (request.idServicio() != null) {
            entidad.setServicio(servicioRepository.findById(request.idServicio())
                    .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado: " + request.idServicio())));
        } else {
            entidad.setServicio(null);
        }
    }

    private Consulta obtenerConsultaVerificada(Integer idConsulta) {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new EntityNotFoundException("Consulta no encontrada: " + idConsulta));
        if (contexto.esDoctor() && !consulta.getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tenés acceso a esta consulta");
        }
        return consulta;
    }

    private void validarPropietario(ConsultaTratamiento entidad) {
        if (contexto.esDoctor()
                && !entidad.getConsulta().getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tenés acceso a este tratamiento");
        }
    }

    private ConsultaTratamiento obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta tratamiento no encontrada: " + id));
    }
}
