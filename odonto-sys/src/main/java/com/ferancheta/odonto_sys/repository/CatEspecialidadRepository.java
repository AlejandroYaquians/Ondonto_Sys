package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.CatEspecialidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatEspecialidadRepository extends JpaRepository<CatEspecialidad, Integer> {

    List<CatEspecialidad> findByActivoTrue();
}
