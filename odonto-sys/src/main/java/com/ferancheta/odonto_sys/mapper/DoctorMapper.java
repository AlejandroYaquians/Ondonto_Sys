package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.DoctorRequest;
import com.ferancheta.odonto_sys.dto.response.DoctorResponse;
import com.ferancheta.odonto_sys.entity.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DoctorMapper {

    @Mapping(target = "idDoctor", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "especialidad", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Doctor toEntity(DoctorRequest request);

    @Mapping(target = "idEspecialidad", source = "especialidad.idEspecialidad")
    @Mapping(target = "idUsuario", source = "usuario.idUsuario")
    DoctorResponse toResponse(Doctor entity);
}
