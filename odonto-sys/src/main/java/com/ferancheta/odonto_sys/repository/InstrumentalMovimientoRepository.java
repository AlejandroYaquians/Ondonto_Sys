package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.InstrumentalMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstrumentalMovimientoRepository extends JpaRepository<InstrumentalMovimiento, Integer> {

    List<InstrumentalMovimiento> findByInstrumental_IdInstrumental(Integer idInstrumental);
}
