package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatMotivoCitaRequest;
import com.ferancheta.odonto_sys.dto.response.CatMotivoCitaResponse;
import com.ferancheta.odonto_sys.entity.CatMotivoCita;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatMotivoCitaMapper {

    @Mapping(target = "idMotivoCita", ignore = true)
    @Mapping(target = "activo", ignore = true)
    CatMotivoCita toEntity(CatMotivoCitaRequest request);

    CatMotivoCitaResponse toResponse(CatMotivoCita entity);
}
