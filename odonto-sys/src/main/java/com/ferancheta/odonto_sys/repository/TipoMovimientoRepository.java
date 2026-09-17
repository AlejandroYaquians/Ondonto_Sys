package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.TipoMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoMovimientoRepository extends JpaRepository<TipoMovimiento, Integer> {

    Optional<TipoMovimiento> findByNombreMovimiento(String nombreMovimiento);
}
