package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatGeneroRequest;
import com.ferancheta.odonto_sys.dto.response.CatGeneroResponse;
import com.ferancheta.odonto_sys.entity.CatGenero;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatGeneroMapper {

    @Mapping(target = "idGenero", ignore = true)
    @Mapping(target = "activo", ignore = true)
    CatGenero toEntity(CatGeneroRequest request);

    CatGeneroResponse toResponse(CatGenero entity);
}
