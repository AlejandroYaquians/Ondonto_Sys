package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.MunicipioRequest;
import com.ferancheta.odonto_sys.dto.response.MunicipioResponse;
import com.ferancheta.odonto_sys.entity.Municipio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MunicipioMapper {

    @Mapping(target = "idMunicipio", ignore = true)
    @Mapping(target = "departamento", ignore = true)
    Municipio toEntity(MunicipioRequest request);

    @Mapping(target = "idDepartamento", source = "departamento.idDepartamento")
    MunicipioResponse toResponse(Municipio entity);
}
