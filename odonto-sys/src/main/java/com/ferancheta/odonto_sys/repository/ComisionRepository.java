package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Comision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ComisionRepository extends JpaRepository<Comision, Integer> {

    List<Comision> findByCobro_IdCobro(Integer idCobro);

    List<Comision> findByFechaBetween(LocalDate desde, LocalDate hasta);

    List<Comision> findByDoctor_IdDoctorAndPagoComisionIsNullOrderByFechaAsc(Integer idDoctor);

    List<Comision> findByDoctor_IdDoctorAndPagoComisionIsNullAndFechaLessThanEqual(Integer idDoctor, LocalDate fecha);

    @Query("SELECT COALESCE(SUM(c.montoComision), 0) FROM Comision c "
            + "WHERE c.doctor.idDoctor = :idDoctor AND c.pagoComision IS NULL")
    BigDecimal sumarPendientePorDoctor(@Param("idDoctor") Integer idDoctor);
}
