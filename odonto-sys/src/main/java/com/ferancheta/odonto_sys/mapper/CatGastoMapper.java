package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatGastoRequest;
import com.ferancheta.odonto_sys.dto.response.CatGastoResponse;
import com.ferancheta.odonto_sys.entity.CatGasto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatGastoMapper {

    @Mapping(target = "idTipoGasto", ignore = true)
    @Mapping(target = "activo", ignore = true)
    CatGasto toEntity(CatGastoRequest request);

    CatGastoResponse toResponse(CatGasto entity);
}
