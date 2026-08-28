package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.CatParentesco;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatParentescoRepository extends JpaRepository<CatParentesco, Integer> {

    List<CatParentesco> findByActivoTrue();
}
