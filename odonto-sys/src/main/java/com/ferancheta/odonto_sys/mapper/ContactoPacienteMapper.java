package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.ContactoPacienteRequest;
import com.ferancheta.odonto_sys.dto.response.ContactoPacienteResponse;
import com.ferancheta.odonto_sys.entity.ContactoPaciente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContactoPacienteMapper {

    @Mapping(target = "idContacto", ignore = true)
    @Mapping(target = "paciente", ignore = true)
    @Mapping(target = "parentesco", ignore = true)
    ContactoPaciente toEntity(ContactoPacienteRequest request);

    @Mapping(target = "idPaciente", source = "paciente.idPaciente")
    @Mapping(target = "idParentesco", source = "parentesco.idParentesco")
    ContactoPacienteResponse toResponse(ContactoPaciente entity);
}
