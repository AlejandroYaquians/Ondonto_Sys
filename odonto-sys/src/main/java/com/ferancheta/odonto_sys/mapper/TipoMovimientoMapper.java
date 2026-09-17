package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.TipoMovimientoResponse;
import com.ferancheta.odonto_sys.entity.TipoMovimiento;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TipoMovimientoMapper {

    TipoMovimientoResponse toResponse(TipoMovimiento entity);
}
