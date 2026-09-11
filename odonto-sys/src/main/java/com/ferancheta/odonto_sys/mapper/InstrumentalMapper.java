package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.InstrumentalRequest;
import com.ferancheta.odonto_sys.dto.response.InstrumentalResponse;
import com.ferancheta.odonto_sys.entity.Instrumental;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InstrumentalMapper {

    @Mapping(target = "idInstrumental", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "stockActual", ignore = true)
    @Mapping(target = "stockMinimo", ignore = true)
    @Mapping(target = "movimientos", ignore = true)
    Instrumental toEntity(InstrumentalRequest request);

    InstrumentalResponse toResponse(Instrumental entity);
}
