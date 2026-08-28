package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.RecetaRequest;
import com.ferancheta.odonto_sys.dto.response.RecetaResponse;
import com.ferancheta.odonto_sys.entity.Receta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RecetaMapper {

    @Mapping(target = "idReceta", ignore = true)
    @Mapping(target = "historialClinico", ignore = true)
    Receta toEntity(RecetaRequest request);

    @Mapping(target = "idHistorialClinico", source = "historialClinico.idHistorialClinico")
    RecetaResponse toResponse(Receta entity);
}
