package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {

    List<Consulta> findByPaciente_IdPaciente(Integer idPaciente);

    List<Consulta> findByDoctor_IdDoctor(Integer idDoctor);
}
