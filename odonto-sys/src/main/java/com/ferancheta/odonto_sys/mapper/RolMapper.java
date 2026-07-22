package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.RolRequest;
import com.ferancheta.odonto_sys.dto.response.RolResponse;
import com.ferancheta.odonto_sys.entity.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RolMapper {

    @Mapping(target = "idRol", ignore = true)
    @Mapping(target = "usuarios", ignore = true)
    @Mapping(target = "permisos", ignore = true)
    Rol toEntity(RolRequest request);

    RolResponse toResponse(Rol entity);
}
