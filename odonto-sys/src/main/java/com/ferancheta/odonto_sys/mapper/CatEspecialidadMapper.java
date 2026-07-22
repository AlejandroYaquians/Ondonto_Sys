package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatEspecialidadRequest;
import com.ferancheta.odonto_sys.dto.response.CatEspecialidadResponse;
import com.ferancheta.odonto_sys.entity.CatEspecialidad;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatEspecialidadMapper {

    @Mapping(target = "idEspecialidad", ignore = true)
    CatEspecialidad toEntity(CatEspecialidadRequest request);

    CatEspecialidadResponse toResponse(CatEspecialidad entity);
}
