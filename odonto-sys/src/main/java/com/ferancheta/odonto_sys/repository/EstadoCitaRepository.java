package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoCitaRepository extends JpaRepository<EstadoCita, Integer> {

    Optional<EstadoCita> findByNombre(String nombre);
}
