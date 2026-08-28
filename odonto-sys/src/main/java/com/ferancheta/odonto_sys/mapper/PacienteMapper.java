package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.PacienteRequest;
import com.ferancheta.odonto_sys.dto.response.PacienteResponse;
import com.ferancheta.odonto_sys.entity.Paciente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PacienteMapper {

    
    @Mapping(target = "idPaciente", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "fechaRegistro", ignore = true)
    @Mapping(target = "genero", ignore = true)
    @Mapping(target = "profesion", ignore = true)
    @Mapping(target = "municipio", ignore = true)
    @Mapping(target = "contactos", ignore = true)
    @Mapping(target = "antecedentesMedicos", ignore = true)
    Paciente toEntity(PacienteRequest request);

    @Mapping(target = "idGenero", source = "genero.idGenero")
    @Mapping(target = "idProfesion", source = "profesion.idProfesion")
    @Mapping(target = "idMunicipio", source = "municipio.idMunicipio")
    PacienteResponse toResponse(Paciente entity);
}
