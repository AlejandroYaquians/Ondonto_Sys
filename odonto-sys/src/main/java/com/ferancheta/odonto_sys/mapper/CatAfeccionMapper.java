package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatAfeccionRequest;
import com.ferancheta.odonto_sys.dto.response.CatAfeccionResponse;
import com.ferancheta.odonto_sys.entity.CatAfeccion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatAfeccionMapper {

    @Mapping(target = "idAfeccion", ignore = true)
    @Mapping(target = "activo", ignore = true)
    CatAfeccion toEntity(CatAfeccionRequest request);

    CatAfeccionResponse toResponse(CatAfeccion entity);
}
