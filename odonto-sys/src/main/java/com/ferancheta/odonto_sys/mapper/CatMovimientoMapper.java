package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.CatMovimientoResponse;
import com.ferancheta.odonto_sys.entity.CatMovimiento;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CatMovimientoMapper {

    CatMovimientoResponse toResponse(CatMovimiento entity);
}
