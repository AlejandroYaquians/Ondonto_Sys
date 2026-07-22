package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatTratamientoRequest;
import com.ferancheta.odonto_sys.dto.response.CatTratamientoResponse;
import com.ferancheta.odonto_sys.entity.CatTratamiento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatTratamientoMapper {

    @Mapping(target = "idTratamiento", ignore = true)
    CatTratamiento toEntity(CatTratamientoRequest request);

    CatTratamientoResponse toResponse(CatTratamiento entity);
}
