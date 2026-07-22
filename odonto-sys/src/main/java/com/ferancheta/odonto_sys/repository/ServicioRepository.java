package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicioRepository extends JpaRepository<Servicio, Integer> {

    List<Servicio> findByActivoTrue();
}
