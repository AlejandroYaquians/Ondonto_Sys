package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.dto.response.PagoComisionResponse;
import com.ferancheta.odonto_sys.entity.PagoComision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PagoComisionRepository extends JpaRepository<PagoComision, Integer> {

    @Query("SELECT MAX(pc.fechaPago) FROM PagoComision pc WHERE pc.doctor.idDoctor = :idDoctor")
    LocalDateTime ultimaFechaPagoPorDoctor(@Param("idDoctor") Integer idDoctor);

    @Query("SELECT new com.ferancheta.odonto_sys.dto.response.PagoComisionResponse("
            + "pc.fechaPago, pc.montoTotal, MIN(c.fecha), MAX(c.fecha), "
            + "CONCAT(pc.usuarioPago.nombre, ' ', COALESCE(pc.usuarioPago.apellido, '')), pc.numeroReferencia) "
            + "FROM PagoComision pc JOIN Comision c ON c.pagoComision = pc "
            + "WHERE pc.doctor.idDoctor = :idDoctor "
            + "GROUP BY pc.idPagoComision, pc.fechaPago, pc.montoTotal, pc.numeroReferencia, "
            + "pc.usuarioPago.nombre, pc.usuarioPago.apellido "
            + "ORDER BY pc.fechaPago DESC")
    List<PagoComisionResponse> historialPagosPorDoctor(@Param("idDoctor") Integer idDoctor);
}
