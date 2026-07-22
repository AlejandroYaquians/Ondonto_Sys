package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatDiagnosticoRequest;
import com.ferancheta.odonto_sys.dto.response.CatDiagnosticoResponse;
import com.ferancheta.odonto_sys.entity.CatDiagnostico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatDiagnosticoMapper {

    @Mapping(target = "idDiagnostico", ignore = true)
    CatDiagnostico toEntity(CatDiagnosticoRequest request);

    CatDiagnosticoResponse toResponse(CatDiagnostico entity);
}
