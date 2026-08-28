package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.CatGasto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatGastoRepository extends JpaRepository<CatGasto, Integer> {

    List<CatGasto> findByActivoTrue();
}
