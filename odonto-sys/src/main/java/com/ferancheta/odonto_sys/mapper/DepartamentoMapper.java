package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.DepartamentoRequest;
import com.ferancheta.odonto_sys.dto.response.DepartamentoResponse;
import com.ferancheta.odonto_sys.entity.Departamento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DepartamentoMapper {

    @Mapping(target = "idDepartamento", ignore = true)
    @Mapping(target = "activo", ignore = true)
    Departamento toEntity(DepartamentoRequest request);

    DepartamentoResponse toResponse(Departamento entity);
}
