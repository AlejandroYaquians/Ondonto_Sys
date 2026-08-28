package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.HistorialClinico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HistorialClinicoRepository extends JpaRepository<HistorialClinico, Integer> {

    List<HistorialClinico> findByPaciente_IdPaciente(Integer idPaciente);

    List<HistorialClinico> findByDoctor_IdDoctor(Integer idDoctor);

    Optional<HistorialClinico> findByCita_IdCita(Integer idCita);
}
