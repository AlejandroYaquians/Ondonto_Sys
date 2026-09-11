package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Instrumental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InstrumentalRepository extends JpaRepository<Instrumental, Integer> {

    List<Instrumental> findByActivoTrue();

    @Query("SELECT i FROM Instrumental i WHERE i.activo = true AND i.stockActual < i.stockMinimo")
    List<Instrumental> findInstrumentalConStockBajo();
}
