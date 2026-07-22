package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Integer> {

    List<Menu> findByModulo_IdModuloAndActivoTrueOrderByOrden(Integer idModulo);

    List<Menu> findByActivoTrueOrderByOrden();
}
