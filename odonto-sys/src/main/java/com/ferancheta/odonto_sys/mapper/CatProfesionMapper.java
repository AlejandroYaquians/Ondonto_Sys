package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatProfesionRequest;
import com.ferancheta.odonto_sys.dto.response.CatProfesionResponse;
import com.ferancheta.odonto_sys.entity.CatProfesion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatProfesionMapper {

    @Mapping(target = "idProfesion", ignore = true)
    @Mapping(target = "activo", ignore = true)
    CatProfesion toEntity(CatProfesionRequest request);

    CatProfesionResponse toResponse(CatProfesion entity);
}
