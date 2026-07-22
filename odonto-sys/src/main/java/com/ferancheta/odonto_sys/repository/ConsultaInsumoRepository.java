package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.ConsultaInsumo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaInsumoRepository extends JpaRepository<ConsultaInsumo, Integer> {

    List<ConsultaInsumo> findByConsultaTratamiento_IdConsultaTratamiento(Integer idConsultaTratamiento);

    List<ConsultaInsumo> findByInsumo_IdInsumo(Integer idInsumo);
}
