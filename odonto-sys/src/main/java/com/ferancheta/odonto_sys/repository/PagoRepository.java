package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PagoRepository extends JpaRepository<Pago, Integer> {

    Optional<Pago> findByNumeroComprobante(String numeroComprobante);

    boolean existsByNumeroComprobante(String numeroComprobante);

    long countByNumeroComprobanteStartingWith(String prefijo);

    List<Pago> findByPaciente_IdPaciente(Integer idPaciente);
}
