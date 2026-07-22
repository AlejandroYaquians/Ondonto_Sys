package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GastoRepository extends JpaRepository<Gasto, Integer> {

    List<Gasto> findByFechaBetween(LocalDate desde, LocalDate hasta);
}
