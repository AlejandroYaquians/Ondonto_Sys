package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

    List<Doctor> findByActivoTrue();

    Optional<Doctor> findByUsuario_IdUsuario(Integer idUsuario);
}
