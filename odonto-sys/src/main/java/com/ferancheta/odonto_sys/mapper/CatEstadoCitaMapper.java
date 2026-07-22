package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatEstadoCitaRequest;
import com.ferancheta.odonto_sys.dto.response.CatEstadoCitaResponse;
import com.ferancheta.odonto_sys.entity.CatEstadoCita;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatEstadoCitaMapper {

    @Mapping(target = "idEstadoCita", ignore = true)
    CatEstadoCita toEntity(CatEstadoCitaRequest request);

    CatEstadoCitaResponse toResponse(CatEstadoCita entity);
}
