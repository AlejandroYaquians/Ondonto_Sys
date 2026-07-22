package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.ServicioRequest;
import com.ferancheta.odonto_sys.dto.response.ServicioResponse;
import com.ferancheta.odonto_sys.entity.Servicio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ServicioMapper {

    @Mapping(target = "idServicio", ignore = true)
    @Mapping(target = "activo", ignore = true)
    Servicio toEntity(ServicioRequest request);

    ServicioResponse toResponse(Servicio entity);
}
