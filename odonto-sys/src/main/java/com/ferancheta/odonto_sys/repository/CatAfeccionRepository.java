package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.CatAfeccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatAfeccionRepository extends JpaRepository<CatAfeccion, Integer> {

    List<CatAfeccion> findByActivoTrue();
}
