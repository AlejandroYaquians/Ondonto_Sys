package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.PagoRequest;
import com.ferancheta.odonto_sys.dto.response.PagoResponse;
import com.ferancheta.odonto_sys.entity.Pago;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PagoMapper {

    @Mapping(target = "idPago", ignore = true)
    @Mapping(target = "fecha", ignore = true)
    @Mapping(target = "numeroComprobante", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "paciente", ignore = true)
    @Mapping(target = "metodoPago", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "detalles", ignore = true)
    @Mapping(target = "comisiones", ignore = true)
    Pago toEntity(PagoRequest request);

    @Mapping(target = "idPaciente", source = "paciente.idPaciente")
    @Mapping(target = "idMetodoPago", source = "metodoPago.idMetodoPago")
    @Mapping(target = "idUsuario", source = "usuario.idUsuario")
    PagoResponse toResponse(Pago entity);
}
