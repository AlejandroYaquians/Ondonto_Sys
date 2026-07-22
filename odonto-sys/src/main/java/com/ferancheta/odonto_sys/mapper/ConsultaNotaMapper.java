package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.ConsultaNotaRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaNotaResponse;
import com.ferancheta.odonto_sys.entity.ConsultaNota;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConsultaNotaMapper {

    @Mapping(target = "idNota", ignore = true)
    @Mapping(target = "fecha", ignore = true)
    @Mapping(target = "consulta", ignore = true)
    @Mapping(target = "doctor", ignore = true)
    @Mapping(target = "usuarioCreacion", ignore = true)
    ConsultaNota toEntity(ConsultaNotaRequest request);

    @Mapping(target = "idConsulta", source = "consulta.idConsulta")
    @Mapping(target = "idDoctor", source = "doctor.idDoctor")
    @Mapping(target = "idUsuarioCreacion", source = "usuarioCreacion.idUsuario")
    ConsultaNotaResponse toResponse(ConsultaNota entity);
}
