package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.HistorialMedicoRequest;
import com.ferancheta.odonto_sys.dto.response.HistorialMedicoResponse;
import com.ferancheta.odonto_sys.entity.HistorialMedico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HistorialMedicoMapper {

    @Mapping(target = "idHistorial", ignore = true)
    @Mapping(target = "paciente", ignore = true)
    @Mapping(target = "afeccion", ignore = true)
    HistorialMedico toEntity(HistorialMedicoRequest request);

    @Mapping(target = "idPaciente", source = "paciente.idPaciente")
    @Mapping(target = "idAfeccion", source = "afeccion.idAfeccion")
    HistorialMedicoResponse toResponse(HistorialMedico entity);
}
