package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.AntecedenteMedico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AntecedenteMedicoRepository extends JpaRepository<AntecedenteMedico, Integer> {

    List<AntecedenteMedico> findByPaciente_IdPaciente(Integer idPaciente);
}
