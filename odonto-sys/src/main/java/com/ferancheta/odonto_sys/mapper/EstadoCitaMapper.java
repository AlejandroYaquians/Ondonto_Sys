package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.EstadoCitaResponse;
import com.ferancheta.odonto_sys.entity.EstadoCita;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EstadoCitaMapper {

    EstadoCitaResponse toResponse(EstadoCita entity);
}
