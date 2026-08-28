package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.HistorialClinicoRequest;
import com.ferancheta.odonto_sys.dto.response.HistorialClinicoResponse;
import com.ferancheta.odonto_sys.entity.HistorialClinico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HistorialClinicoMapper {

    @Mapping(target = "idHistorialClinico", ignore = true)
    @Mapping(target = "fecha", ignore = true)
    @Mapping(target = "cita", ignore = true)
    @Mapping(target = "paciente", ignore = true)
    @Mapping(target = "doctor", ignore = true)
    @Mapping(target = "recetas", ignore = true)
    HistorialClinico toEntity(HistorialClinicoRequest request);

    @Mapping(target = "idCita", source = "cita.idCita")
    @Mapping(target = "idPaciente", source = "paciente.idPaciente")
    @Mapping(target = "idDoctor", source = "doctor.idDoctor")
    HistorialClinicoResponse toResponse(HistorialClinico entity);
}
