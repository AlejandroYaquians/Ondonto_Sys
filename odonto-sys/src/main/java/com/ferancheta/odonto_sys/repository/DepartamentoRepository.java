package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartamentoRepository extends JpaRepository<Departamento, Integer> {

    List<Departamento> findByActivoTrue();
}
