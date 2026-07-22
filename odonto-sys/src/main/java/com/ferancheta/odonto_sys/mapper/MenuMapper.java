package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.MenuRequest;
import com.ferancheta.odonto_sys.dto.response.MenuResponse;
import com.ferancheta.odonto_sys.entity.Menu;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MenuMapper {

    @Mapping(target = "idMenu", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "modulo", ignore = true)
    @Mapping(target = "permisos", ignore = true)
    Menu toEntity(MenuRequest request);

    @Mapping(target = "idModulo", source = "modulo.idModulo")
    MenuResponse toResponse(Menu entity);
}
