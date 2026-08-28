package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.AntecedenteMedicoRequest;
import com.ferancheta.odonto_sys.dto.response.AntecedenteMedicoResponse;
import com.ferancheta.odonto_sys.entity.AntecedenteMedico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AntecedenteMedicoMapper {

    @Mapping(target = "idAntecedente", ignore = true)
    @Mapping(target = "paciente", ignore = true)
    @Mapping(target = "afeccion", ignore = true)
    AntecedenteMedico toEntity(AntecedenteMedicoRequest request);

    @Mapping(target = "idPaciente", source = "paciente.idPaciente")
    @Mapping(target = "idAfeccion", source = "afeccion.idAfeccion")
    AntecedenteMedicoResponse toResponse(AntecedenteMedico entity);
}
