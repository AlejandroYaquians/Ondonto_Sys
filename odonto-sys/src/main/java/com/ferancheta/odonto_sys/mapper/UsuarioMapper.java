package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.UsuarioRequest;
import com.ferancheta.odonto_sys.dto.response.UsuarioResponse;
import com.ferancheta.odonto_sys.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "idUsuario", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "rol", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Usuario toEntity(UsuarioRequest request);

    @Mapping(target = "idRol", source = "rol.idRol")
    UsuarioResponse toResponse(Usuario entity);
}
