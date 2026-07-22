package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.GastoRequest;
import com.ferancheta.odonto_sys.dto.response.GastoResponse;
import com.ferancheta.odonto_sys.entity.Gasto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GastoMapper {

    @Mapping(target = "idGasto", ignore = true)
    @Mapping(target = "tipoGasto", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Gasto toEntity(GastoRequest request);

    @Mapping(target = "idTipoGasto", source = "tipoGasto.idTipoGasto")
    @Mapping(target = "idUsuario", source = "usuario.idUsuario")
    GastoResponse toResponse(Gasto entity);
}
