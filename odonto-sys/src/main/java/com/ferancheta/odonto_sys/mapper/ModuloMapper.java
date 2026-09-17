package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.ModuloResponse;
import com.ferancheta.odonto_sys.entity.Modulo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ModuloMapper {

    ModuloResponse toResponse(Modulo entity);
}
