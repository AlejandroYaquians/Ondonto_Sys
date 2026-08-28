package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.CatMetodoPagoRequest;
import com.ferancheta.odonto_sys.dto.response.CatMetodoPagoResponse;
import com.ferancheta.odonto_sys.entity.CatMetodoPago;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatMetodoPagoMapper {

    @Mapping(target = "idMetodoPago", ignore = true)
    @Mapping(target = "activo", ignore = true)
    CatMetodoPago toEntity(CatMetodoPagoRequest request);

    CatMetodoPagoResponse toResponse(CatMetodoPago entity);
}
