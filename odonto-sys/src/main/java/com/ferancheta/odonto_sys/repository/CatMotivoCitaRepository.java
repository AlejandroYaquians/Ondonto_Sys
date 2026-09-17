package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.CatMotivoCita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatMotivoCitaRepository extends JpaRepository<CatMotivoCita, Integer> {

    List<CatMotivoCita> findByActivoTrue();
}
