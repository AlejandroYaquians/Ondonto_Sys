package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.CatEstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CatEstadoCitaRepository extends JpaRepository<CatEstadoCita, Integer> {

    Optional<CatEstadoCita> findByNombre(String nombre);
}
