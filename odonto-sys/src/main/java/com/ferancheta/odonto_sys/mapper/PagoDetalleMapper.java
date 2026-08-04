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
    @Mapping(target = "consultaTratamiento", ignore = true)
    PagoDetalle toEntity(PagoDetalleRequest request);

    @Mapping(target = "idPago", source = "pago.idPago")
    @Mapping(target = "idServicio", source = "servicio.idServicio")
    @Mapping(target = "idMetodoPago", source = "metodoPago.idMetodoPago")
    @Mapping(target = "idConsultaTratamiento", source = "consultaTratamiento.idConsultaTratamiento")
    PagoDetalleResponse toResponse(PagoDetalle entity);
}
