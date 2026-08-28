package com.ferancheta.odonto_sys.repository;

import com.ferancheta.odonto_sys.entity.Receta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecetaRepository extends JpaRepository<Receta, Integer> {

    List<Receta> findByHistorialClinico_IdHistorialClinico(Integer idHistorialClinico);

    List<Receta> findByHistorialClinico_Paciente_IdPaciente(Integer idPaciente);
}
