package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.BitacoraResponse;
import com.ferancheta.odonto_sys.entity.Bitacora;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BitacoraMapper {

    @Mapping(target = "idUsuario", source = "usuario.idUsuario")
    BitacoraResponse toResponse(Bitacora entity);
}
