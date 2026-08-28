package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.CatMotivoCitaResponse;
import com.ferancheta.odonto_sys.entity.CatMotivoCita;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CatMotivoCitaMapper {

    CatMotivoCitaResponse toResponse(CatMotivoCita entity);
}
