package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Cobro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CobroRepository extends JpaRepository<Cobro, Integer> {

    List<Cobro> findByPaciente_IdPaciente(Integer idPaciente);

    List<Cobro> findByCita_IdCita(Integer idCita);

    List<Cobro> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta);

    List<Cobro> findByFechaBetweenOrderByFechaDesc(LocalDateTime desde, LocalDateTime hasta);
}
