package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.CatProfesion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatProfesionRepository extends JpaRepository<CatProfesion, Integer> {

    List<CatProfesion> findByActivoTrue();
}
