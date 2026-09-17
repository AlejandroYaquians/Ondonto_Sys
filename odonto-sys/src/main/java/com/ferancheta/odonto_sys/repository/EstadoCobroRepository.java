package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.EstadoCobro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoCobroRepository extends JpaRepository<EstadoCobro, Integer> {

    Optional<EstadoCobro> findByNombreIgnoreCase(String nombre);
}
