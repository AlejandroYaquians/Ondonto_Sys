package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ComisionRequest;
import com.ferancheta.odonto_sys.dto.response.ComisionResponse;
import com.ferancheta.odonto_sys.entity.Comision;
import com.ferancheta.odonto_sys.mapper.ComisionMapper;
import com.ferancheta.odonto_sys.repository.CobroRepository;
import com.ferancheta.odonto_sys.repository.ComisionRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ComisionService {

    private final ComisionRepository repository;
    private final DoctorRepository doctorRepository;
    private final CobroRepository cobroRepository;
    private final UsuarioRepository usuarioRepository;
    private final ComisionMapper mapper;

    @Transactional(readOnly = true)
    public List<ComisionResponse> listarPorDoctorYEstado(Integer idDoctor, String estado) {
        return repository.findByDoctor_IdDoctorAndEstado(idDoctor, estado).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ComisionResponse> listarPorCobro(Integer idCobro) {
        return repository.findByCobro_IdCobro(idCobro).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ComisionResponse> listarPorRangoFecha(LocalDate desde, LocalDate hasta, Integer idDoctor) {
        return repository.findByFechaBetween(desde, hasta).stream()
                .filter(c -> idDoctor == null || c.getDoctor().getIdDoctor().equals(idDoctor))
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ComisionResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ComisionResponse crear(ComisionRequest request) {
        Comision entidad = mapper.toEntity(request);
        entidad.setEstado("pendiente");
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public ComisionResponse actualizar(Integer id, ComisionRequest request) {
        Comision existente = obtenerEntidad(id);
        Comision actualizada = mapper.toEntity(request);
        actualizada.setIdComision(existente.getIdComision());
        actualizada.setEstado(existente.getEstado());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(repository.save(actualizada));
    }

    @Transactional
    public ComisionResponse cambiarEstado(Integer id, String estado) {
        Comision comision = obtenerEntidad(id);
        comision.setEstado(estado);
        return mapper.toResponse(repository.save(comision));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(Comision entidad, ComisionRequest request) {
        entidad.setDoctor(doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor())));
        entidad.setCobro(cobroRepository.findById(request.idCobro())
                .orElseThrow(() -> new EntityNotFoundException("Cobro no encontrado: " + request.idCobro())));

        if (request.idUsuarioCreacion() != null) {
            entidad.setUsuarioCreacion(usuarioRepository.findById(request.idUsuarioCreacion())
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuarioCreacion())));
        } else {
            entidad.setUsuarioCreacion(null);
        }
    }

    private Comision obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comisión no encontrada: " + id));
    }
}
