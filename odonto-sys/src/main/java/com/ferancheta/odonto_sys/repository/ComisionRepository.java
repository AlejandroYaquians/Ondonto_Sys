package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Comision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComisionRepository extends JpaRepository<Comision, Integer> {

    List<Comision> findByDoctor_IdDoctorAndEstado(Integer idDoctor, String estado);

    List<Comision> findByPago_IdPago(Integer idPago);
}
