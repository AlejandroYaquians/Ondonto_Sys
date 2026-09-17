package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.ComisionRequest;
import com.ferancheta.odonto_sys.dto.response.ComisionResponse;
import com.ferancheta.odonto_sys.entity.Comision;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ComisionMapper {

    @Mapping(target = "idComision", ignore = true)
    @Mapping(target = "estadoComision", ignore = true)
    @Mapping(target = "doctor", ignore = true)
    @Mapping(target = "cobro", ignore = true)
    @Mapping(target = "usuarioCreacion", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Comision toEntity(ComisionRequest request);

    @Mapping(target = "estado", source = "estadoComision.nombre")
    @Mapping(target = "idDoctor", source = "doctor.idDoctor")
    @Mapping(target = "idCobro", source = "cobro.idCobro")
    @Mapping(target = "idUsuarioCreacion", source = "usuarioCreacion.idUsuario")
    ComisionResponse toResponse(Comision entity);
}
