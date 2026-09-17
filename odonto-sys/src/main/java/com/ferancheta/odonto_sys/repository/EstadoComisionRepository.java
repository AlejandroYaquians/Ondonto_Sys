package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.EstadoComision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoComisionRepository extends JpaRepository<EstadoComision, Integer> {

    Optional<EstadoComision> findByNombreIgnoreCase(String nombre);
}
