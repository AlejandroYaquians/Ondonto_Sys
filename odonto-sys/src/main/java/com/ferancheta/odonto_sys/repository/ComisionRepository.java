package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.dto.response.PagoComisionResponse;
import com.ferancheta.odonto_sys.entity.Comision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ComisionRepository extends JpaRepository<Comision, Integer> {

    List<Comision> findByDoctor_IdDoctorAndEstadoComision_NombreIgnoreCase(Integer idDoctor, String estado);

    List<Comision> findByCobro_IdCobro(Integer idCobro);

    List<Comision> findByFechaBetween(LocalDate desde, LocalDate hasta);

    List<Comision> findByDoctor_IdDoctorAndEstadoComision_NombreIgnoreCaseOrderByFechaAsc(Integer idDoctor, String estado);

    List<Comision> findByDoctor_IdDoctorAndEstadoComision_NombreIgnoreCaseAndFechaLessThanEqual(
            Integer idDoctor, String estado, LocalDate fecha);

    @Query("SELECT COALESCE(SUM(c.montoComision), 0) FROM Comision c "
            + "WHERE c.doctor.idDoctor = :idDoctor AND LOWER(c.estadoComision.nombre) = 'pendiente'")
    BigDecimal sumarPendientePorDoctor(@Param("idDoctor") Integer idDoctor);

    @Query("SELECT MAX(c.fechaPago) FROM Comision c "
            + "WHERE c.doctor.idDoctor = :idDoctor AND LOWER(c.estadoComision.nombre) = 'pagada'")
    LocalDateTime ultimaFechaPagoPorDoctor(@Param("idDoctor") Integer idDoctor);

    @Query("SELECT new com.ferancheta.odonto_sys.dto.response.PagoComisionResponse("
            + "c.fechaPago, SUM(c.montoComision), MIN(c.fecha), MAX(c.fecha), "
            + "CONCAT(c.usuarioPago.nombre, ' ', COALESCE(c.usuarioPago.apellido, ''))) "
            + "FROM Comision c WHERE c.doctor.idDoctor = :idDoctor AND LOWER(c.estadoComision.nombre) = 'pagada' "
            + "GROUP BY c.fechaPago, c.usuarioPago.nombre, c.usuarioPago.apellido "
            + "ORDER BY c.fechaPago DESC")
    List<PagoComisionResponse> historialPagosPorDoctor(@Param("idDoctor") Integer idDoctor);
}
