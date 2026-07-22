package com.ferancheta.odonto_sys.mapper;

import com.ferancheta.odonto_sys.dto.request.ConsultaDiagnosticoRequest;
import com.ferancheta.odonto_sys.dto.response.ConsultaDiagnosticoResponse;
import com.ferancheta.odonto_sys.entity.ConsultaDiagnostico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConsultaDiagnosticoMapper {

    @Mapping(target = "idConsultaDiagnostico", ignore = true)
    @Mapping(target = "consulta", ignore = true)
    @Mapping(target = "diagnostico", ignore = true)
    ConsultaDiagnostico toEntity(ConsultaDiagnosticoRequest request);

    @Mapping(target = "idConsulta", source = "consulta.idConsulta")
    @Mapping(target = "idDiagnostico", source = "diagnostico.idDiagnostico")
    ConsultaDiagnosticoResponse toResponse(ConsultaDiagnostico entity);
}
