package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.CatMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CatMovimientoRepository extends JpaRepository<CatMovimiento, Integer> {

    Optional<CatMovimiento> findByNombreMovimiento(String nombreMovimiento);
}
