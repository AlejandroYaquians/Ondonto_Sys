package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.ModuloRequest;
import com.ferancheta.odonto_sys.dto.response.ModuloResponse;
import com.ferancheta.odonto_sys.entity.Modulo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ModuloMapper {

    @Mapping(target = "idModulo", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "menus", ignore = true)
    Modulo toEntity(ModuloRequest request);

    ModuloResponse toResponse(Modulo entity);
}
