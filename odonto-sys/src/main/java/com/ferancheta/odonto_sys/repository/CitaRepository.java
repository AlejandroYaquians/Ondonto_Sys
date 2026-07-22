package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Integer> {

    List<Cita> findByDoctor_IdDoctorAndFecha(Integer idDoctor, LocalDate fecha);

    List<Cita> findByPaciente_IdPaciente(Integer idPaciente);

    @Query("""
        SELECT c FROM Cita c
        WHERE c.doctor.idDoctor = :idDoctor
          AND c.fecha = :fecha
          AND (:idCita IS NULL OR c.idCita <> :idCita)
          AND c.hora < :horaFin
          AND c.horaFin > :horaInicio
        """)
    List<Cita> findTraslapes(@Param("idDoctor") Integer idDoctor,
                              @Param("fecha") LocalDate fecha,
                              @Param("horaInicio") LocalTime horaInicio,
                              @Param("horaFin") LocalTime horaFin,
                              @Param("idCita") Integer idCita);
}
