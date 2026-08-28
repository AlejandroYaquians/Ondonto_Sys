package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Municipio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MunicipioRepository extends JpaRepository<Municipio, Integer> {

    List<Municipio> findByDepartamento_IdDepartamento(Integer idDepartamento);

    List<Municipio> findByActivoTrue();

    List<Municipio> findByDepartamento_IdDepartamentoAndActivoTrue(Integer idDepartamento);
}
