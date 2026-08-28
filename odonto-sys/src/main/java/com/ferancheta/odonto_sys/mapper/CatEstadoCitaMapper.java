package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.CatEstadoCitaResponse;
import com.ferancheta.odonto_sys.entity.CatEstadoCita;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CatEstadoCitaMapper {

    CatEstadoCitaResponse toResponse(CatEstadoCita entity);
}
