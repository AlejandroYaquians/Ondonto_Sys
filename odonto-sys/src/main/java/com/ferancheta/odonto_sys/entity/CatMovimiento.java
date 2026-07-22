package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cat_movimiento")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatMovimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_movimiento")
    private Integer idTipoMovimiento;

    @Column(name = "nombre_movimiento", nullable = false, length = 45)
    private String nombreMovimiento;

    @Column(name = "operacion", nullable = false)
    private Boolean operacion;
}