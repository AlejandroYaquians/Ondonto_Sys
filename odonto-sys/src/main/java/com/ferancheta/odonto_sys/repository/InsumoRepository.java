package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InsumoRepository extends JpaRepository<Insumo, Integer> {

    List<Insumo> findByActivoTrue();

    @Query("SELECT i FROM Insumo i WHERE i.activo = true AND i.stockActual <= i.stockMinimo")
    List<Insumo> findConStockBajo();
}
