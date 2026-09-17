package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.RolResponse;
import com.ferancheta.odonto_sys.entity.Rol;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RolMapper {

    RolResponse toResponse(Rol entity);
}
