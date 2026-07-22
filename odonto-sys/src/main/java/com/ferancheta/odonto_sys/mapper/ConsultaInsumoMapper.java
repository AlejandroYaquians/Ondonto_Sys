package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.ConsultaInsumoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaInsumoResponse;
import com.ferancheta.odonto_sys.entity.ConsultaInsumo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConsultaInsumoMapper {

    @Mapping(target = "idConsultaInsumo", ignore = true)
    @Mapping(target = "fecha", ignore = true)
    @Mapping(target = "consultaTratamiento", ignore = true)
    @Mapping(target = "insumo", ignore = true)
    @Mapping(target = "usuarioCreacion", ignore = true)
    ConsultaInsumo toEntity(ConsultaInsumoRequest request);

    @Mapping(target = "idConsultaTratamiento", source = "consultaTratamiento.idConsultaTratamiento")
    @Mapping(target = "idInsumo", source = "insumo.idInsumo")
    @Mapping(target = "idUsuarioCreacion", source = "usuarioCreacion.idUsuario")
    ConsultaInsumoResponse toResponse(ConsultaInsumo entity);
}
