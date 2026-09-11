package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.InstrumentalMovimientoRequest;
import com.ferancheta.odonto_sys.dto.response.InstrumentalMovimientoResponse;
import com.ferancheta.odonto_sys.entity.InstrumentalMovimiento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InstrumentalMovimientoMapper {

    @Mapping(target = "idInstrumentalMovimiento", ignore = true)
    @Mapping(target = "fecha", ignore = true)
    @Mapping(target = "instrumental", ignore = true)
    @Mapping(target = "tipoMovimiento", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    InstrumentalMovimiento toEntity(InstrumentalMovimientoRequest request);

    @Mapping(target = "idInstrumental", source = "instrumental.idInstrumental")
    @Mapping(target = "idTipoMovimiento", source = "tipoMovimiento.idTipoMovimiento")
    @Mapping(target = "idUsuario", source = "usuario.idUsuario")
    InstrumentalMovimientoResponse toResponse(InstrumentalMovimiento entity);
}
