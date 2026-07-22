package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.ConsultaDiagnostico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaDiagnosticoRepository extends JpaRepository<ConsultaDiagnostico, Integer> {

    List<ConsultaDiagnostico> findByConsulta_IdConsulta(Integer idConsulta);
}
