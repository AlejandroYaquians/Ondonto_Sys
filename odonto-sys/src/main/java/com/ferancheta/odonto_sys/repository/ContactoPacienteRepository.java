package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.ContactoPaciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactoPacienteRepository extends JpaRepository<ContactoPaciente, Integer> {

    List<ContactoPaciente> findByPaciente_IdPaciente(Integer idPaciente);
}
