package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.PagoDetalleRequest;
import com.ferancheta.odonto_sys.dto.response.PagoDetalleResponse;
import com.ferancheta.odonto_sys.entity.PagoDetalle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PagoDetalleMapper {

    @Mapping(target = "idDetallePago", ignore = true)
    @Mapping(target = "comisionDoctorCalculada", ignore = true)
    @Mapping(target = "pago", ignore = true)
    @Mapping(target = "servicio", ignore = true)
    @Mapping(target = "metodoPago", ignore = true)
    PagoDetalle toEntity(PagoDetalleRequest request);

    @Mapping(target = "idPago", source = "pago.idPago")
    @Mapping(target = "idServicio", source = "servicio.idServicio")
    @Mapping(target = "idMetodoPago", source = "metodoPago.idMetodoPago")
    PagoDetalleResponse toResponse(PagoDetalle entity);
}
