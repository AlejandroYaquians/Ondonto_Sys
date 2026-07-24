package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.ContactoPacienteRequest;
import com.ferancheta.odonto_sys.dto.response.ContactoPacienteResponse;
import com.ferancheta.odonto_sys.entity.ContactoPaciente;
import com.ferancheta.odonto_sys.mapper.ContactoPacienteMapper;
import com.ferancheta.odonto_sys.repository.CatParentescoRepository;
import com.ferancheta.odonto_sys.repository.ContactoPacienteRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactoPacienteService {

    private final ContactoPacienteRepository repository;
    private final PacienteRepository pacienteRepository;
    private final CatParentescoRepository catParentescoRepository;
    private final ContactoPacienteMapper mapper;

    @Transactional(readOnly = true)
    public List<ContactoPacienteResponse> listarPorPaciente(Integer idPaciente) {
        return repository.findByPaciente_IdPaciente(idPaciente).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ContactoPacienteResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public ContactoPacienteResponse crear(ContactoPacienteRequest request) {
        ContactoPaciente entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public ContactoPacienteResponse actualizar(Integer id, ContactoPacienteRequest request) {
        ContactoPaciente existente = obtenerEntidad(id);
        ContactoPaciente actualizado = mapper.toEntity(request);
        actualizado.setIdContacto(existente.getIdContacto());
        aplicarRelaciones(actualizado, request);
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private void aplicarRelaciones(ContactoPaciente entidad, ContactoPacienteRequest request) {
        entidad.setPaciente(pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente())));

        if (request.idParentesco() != null) {
            entidad.setParentesco(catParentescoRepository.findById(request.idParentesco())
                    .orElseThrow(() -> new EntityNotFoundException("Parentesco no encontrado: " + request.idParentesco())));
        } else {
            entidad.setParentesco(null);
        }
    }

    private ContactoPaciente obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contacto no encontrado: " + id));
    }
}
