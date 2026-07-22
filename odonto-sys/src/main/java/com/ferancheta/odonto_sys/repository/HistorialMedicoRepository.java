package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.HistorialMedico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialMedicoRepository extends JpaRepository<HistorialMedico, Integer> {

    List<HistorialMedico> findByPaciente_IdPaciente(Integer idPaciente);
}
