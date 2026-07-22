package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Bitacora;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BitacoraRepository extends JpaRepository<Bitacora, Integer> {

    List<Bitacora> findByTablaAfectadaAndIdRegistroOrderByFechaHoraDesc(String tablaAfectada, Integer idRegistro);

    List<Bitacora> findByUsuario_IdUsuario(Integer idUsuario);
}
