package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuloRepository extends JpaRepository<Modulo, Integer> {

    List<Modulo> findByActivoTrue();
}
