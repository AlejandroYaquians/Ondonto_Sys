package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.InsumoServicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InsumoServicioRepository extends JpaRepository<InsumoServicio, Integer> {

    List<InsumoServicio> findByServicio_IdServicio(Integer idServicio);

    List<InsumoServicio> findByInsumo_IdInsumo(Integer idInsumo);
}
