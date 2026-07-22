package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.ConsultaNota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaNotaRepository extends JpaRepository<ConsultaNota, Integer> {

    List<ConsultaNota> findByConsulta_IdConsulta(Integer idConsulta);
}
