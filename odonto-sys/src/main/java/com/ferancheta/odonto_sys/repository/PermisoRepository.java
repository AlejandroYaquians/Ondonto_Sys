package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermisoRepository extends JpaRepository<Permiso, Integer> {

    List<Permiso> findByRol_IdRol(Integer idRol);

    Optional<Permiso> findByRol_IdRolAndMenu_IdMenu(Integer idRol, Integer idMenu);
}
