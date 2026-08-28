package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

    List<Paciente> findByActivoTrue();

    List<Paciente> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);

    List<Paciente> findByActivoTrueAndNombreContainingIgnoreCaseOrActivoTrueAndApellidoContainingIgnoreCase(
            String nombre, String apellido);
}
