package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.InsumoMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InsumoMovimientoRepository extends JpaRepository<InsumoMovimiento, Integer> {

    List<InsumoMovimiento> findByInsumo_IdInsumo(Integer idInsumo);
}
