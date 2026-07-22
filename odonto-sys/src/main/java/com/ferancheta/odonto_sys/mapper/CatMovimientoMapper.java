package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatMovimientoRequest;
import com.ferancheta.odonto_sys.dto.response.CatMovimientoResponse;
import com.ferancheta.odonto_sys.entity.CatMovimiento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatMovimientoMapper {

    @Mapping(target = "idTipoMovimiento", ignore = true)
    CatMovimiento toEntity(CatMovimientoRequest request);

    CatMovimientoResponse toResponse(CatMovimiento entity);
}
