package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.InsumoMovimientoRequest;
import com.ferancheta.odonto_sys.dto.response.InsumoMovimientoResponse;
import com.ferancheta.odonto_sys.entity.InsumoMovimiento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InsumoMovimientoMapper {

    @Mapping(target = "idMovimiento", ignore = true)
    @Mapping(target = "fecha", ignore = true)
    @Mapping(target = "insumo", ignore = true)
    @Mapping(target = "tipoMovimiento", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    InsumoMovimiento toEntity(InsumoMovimientoRequest request);

    @Mapping(target = "idInsumo", source = "insumo.idInsumo")
    @Mapping(target = "idTipoMovimiento", source = "tipoMovimiento.idTipoMovimiento")
    @Mapping(target = "idUsuario", source = "usuario.idUsuario")
    InsumoMovimientoResponse toResponse(InsumoMovimiento entity);
}
