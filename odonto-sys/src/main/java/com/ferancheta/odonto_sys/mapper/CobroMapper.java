package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.response.CobroResponse;
import com.ferancheta.odonto_sys.entity.Cobro;
import com.ferancheta.odonto_sys.entity.CobroDetalle;
import com.ferancheta.odonto_sys.entity.Comision;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class CobroMapper {

    @Mapping(target = "idPaciente", source = "paciente.idPaciente")
    @Mapping(target = "idCita", source = "cita.idCita")
    @Mapping(target = "idMetodoPago", source = "metodoPago.idMetodoPago")
    @Mapping(target = "idUsuario", source = "usuario.idUsuario")
    @Mapping(target = "idServicio", expression = "java(primerDetalle(entity) != null ? primerDetalle(entity).getServicio().getIdServicio() : null)")
    @Mapping(target = "precioAplicado", expression = "java(primerDetalle(entity) != null ? primerDetalle(entity).getPrecioAplicado() : null)")
    @Mapping(target = "idDoctor", expression = "java(primeraComision(entity) != null ? primeraComision(entity).getDoctor().getIdDoctor() : null)")
    @Mapping(target = "comisionDoctor", expression = "java(primeraComision(entity) != null ? primeraComision(entity).getMontoComision() : null)")
    public abstract CobroResponse toResponse(Cobro entity);

    protected CobroDetalle primerDetalle(Cobro entity) {
        return entity.getDetalles() == null || entity.getDetalles().isEmpty() ? null : entity.getDetalles().get(0);
    }

    protected Comision primeraComision(Cobro entity) {
        return entity.getComisiones() == null || entity.getComisiones().isEmpty() ? null : entity.getComisiones().get(0);
    }
}
