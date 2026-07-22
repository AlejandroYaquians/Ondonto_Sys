package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.PermisoRequest;
import com.ferancheta.odonto_sys.dto.response.PermisoResponse;
import com.ferancheta.odonto_sys.entity.Permiso;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PermisoMapper {

    @Mapping(target = "idPermiso", ignore = true)
    @Mapping(target = "rol", ignore = true)
    @Mapping(target = "menu", ignore = true)
    Permiso toEntity(PermisoRequest request);

    @Mapping(target = "idRol", source = "rol.idRol")
    @Mapping(target = "idMenu", source = "menu.idMenu")
    PermisoResponse toResponse(Permiso entity);
}
