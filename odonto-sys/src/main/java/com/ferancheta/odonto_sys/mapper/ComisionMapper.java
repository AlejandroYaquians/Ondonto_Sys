package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.ComisionResponse;
import com.ferancheta.odonto_sys.entity.Comision;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ComisionMapper {

    @Mapping(target = "idDoctor", source = "doctor.idDoctor")
    @Mapping(target = "idCobro", source = "cobro.idCobro")
    @Mapping(target = "idUsuarioCreacion", source = "usuarioCreacion.idUsuario")
    @Mapping(target = "idPagoComision", source = "pagoComision.idPagoComision")
    ComisionResponse toResponse(Comision entity);
}
