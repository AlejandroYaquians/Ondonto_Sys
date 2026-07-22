package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.ConsultaTratamiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaTratamientoRepository extends JpaRepository<ConsultaTratamiento, Integer> {

    List<ConsultaTratamiento> findByConsulta_IdConsulta(Integer idConsulta);
}
