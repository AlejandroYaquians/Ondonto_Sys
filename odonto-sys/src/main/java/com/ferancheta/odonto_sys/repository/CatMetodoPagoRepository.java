package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.CatMetodoPago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CatMetodoPagoRepository extends JpaRepository<CatMetodoPago, Integer> {

    Optional<CatMetodoPago> findByNombreIgnoreCase(String nombre);
}
