package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.InsumoServicioRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoServicioResponse;
import com.ferancheta.odonto_sys.entity.InsumoServicio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InsumoServicioMapper {

    @Mapping(target = "idInsumoServicio", ignore = true)
    @Mapping(target = "insumo", ignore = true)
    @Mapping(target = "servicio", ignore = true)
    InsumoServicio toEntity(InsumoServicioRequest request);

    @Mapping(target = "idInsumo", source = "insumo.idInsumo")
    @Mapping(target = "idServicio", source = "servicio.idServicio")
    InsumoServicioResponse toResponse(InsumoServicio entity);
}
