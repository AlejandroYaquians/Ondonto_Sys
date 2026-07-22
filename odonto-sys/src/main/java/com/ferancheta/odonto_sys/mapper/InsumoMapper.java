package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.InsumoRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoResponse;
import com.ferancheta.odonto_sys.entity.Insumo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InsumoMapper {

    @Mapping(target = "idInsumo", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "movimientos", ignore = true)
    @Mapping(target = "servicios", ignore = true)
    Insumo toEntity(InsumoRequest request);

    InsumoResponse toResponse(Insumo entity);
}
