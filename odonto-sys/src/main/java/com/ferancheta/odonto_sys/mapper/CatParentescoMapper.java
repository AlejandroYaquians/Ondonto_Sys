package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatParentescoRequest;
import com.ferancheta.odonto_sys.dto.response.CatParentescoResponse;
import com.ferancheta.odonto_sys.entity.CatParentesco;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatParentescoMapper {

    @Mapping(target = "idParentesco", ignore = true)
    @Mapping(target = "activo", ignore = true)
    CatParentesco toEntity(CatParentescoRequest request);

    CatParentescoResponse toResponse(CatParentesco entity);
}
