package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.PagoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagoDetalleRepository extends JpaRepository<PagoDetalle, Integer> {

    List<PagoDetalle> findByPago_IdPago(Integer idPago);
}
