package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.ConsultaTratamientoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaTratamientoResponse;
import com.ferancheta.odonto_sys.entity.ConsultaTratamiento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConsultaTratamientoMapper {

    @Mapping(target = "idConsultaTratamiento", ignore = true)
    @Mapping(target = "consulta", ignore = true)
    @Mapping(target = "tratamiento", ignore = true)
    @Mapping(target = "servicio", ignore = true)
    @Mapping(target = "insumosUsados", ignore = true)
    ConsultaTratamiento toEntity(ConsultaTratamientoRequest request);

    @Mapping(target = "idConsulta", source = "consulta.idConsulta")
    @Mapping(target = "idTratamiento", source = "tratamiento.idTratamiento")
    @Mapping(target = "idServicio", source = "servicio.idServicio")
    ConsultaTratamientoResponse toResponse(ConsultaTratamiento entity);
}
