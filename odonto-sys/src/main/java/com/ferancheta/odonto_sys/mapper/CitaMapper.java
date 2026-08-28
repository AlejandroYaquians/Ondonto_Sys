package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CitaRequest;
import com.ferancheta.odonto_sys.dto.response.CitaResponse;
import com.ferancheta.odonto_sys.entity.Cita;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CitaMapper {

    @Mapping(target = "idCita", ignore = true)
    @Mapping(target = "paciente", ignore = true)
    @Mapping(target = "doctor", ignore = true)
    @Mapping(target = "estadoCita", ignore = true)
    @Mapping(target = "motivoCita", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Cita toEntity(CitaRequest request);

    @Mapping(target = "idPaciente", source = "paciente.idPaciente")
    @Mapping(target = "idDoctor", source = "doctor.idDoctor")
    @Mapping(target = "idEstadoCita", source = "estadoCita.idEstadoCita")
    @Mapping(target = "idMotivoCita", source = "motivoCita.idMotivoCita")
    @Mapping(target = "idUsuario", source = "usuario.idUsuario")
    CitaResponse toResponse(Cita entity);
}
