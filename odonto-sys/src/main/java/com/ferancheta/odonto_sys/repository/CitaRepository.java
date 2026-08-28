package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Integer> {

    List<Cita> findByDoctor_IdDoctorAndFecha(Integer idDoctor, LocalDate fecha);

    List<Cita> findByDoctor_IdDoctor(Integer idDoctor);

    List<Cita> findByPaciente_IdPaciente(Integer idPaciente);
}
