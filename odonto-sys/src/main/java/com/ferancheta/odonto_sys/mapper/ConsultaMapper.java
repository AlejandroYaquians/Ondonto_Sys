package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.ConsultaRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaResponse;
import com.ferancheta.odonto_sys.entity.Consulta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConsultaMapper {

    @Mapping(target = "idConsulta", ignore = true)
    @Mapping(target = "paciente", ignore = true)
    @Mapping(target = "doctor", ignore = true)
    @Mapping(target = "cita", ignore = true)
    @Mapping(target = "diagnosticos", ignore = true)
    @Mapping(target = "tratamientos", ignore = true)
    @Mapping(target = "recetas", ignore = true)
    @Mapping(target = "notas", ignore = true)
    Consulta toEntity(ConsultaRequest request);

    @Mapping(target = "idPaciente", source = "paciente.idPaciente")
    @Mapping(target = "idDoctor", source = "doctor.idDoctor")
    @Mapping(target = "idCita", source = "cita.idCita")
    ConsultaResponse toResponse(Consulta entity);
}
