package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cat_servicio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Integer idServicio;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "costo_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoBase = BigDecimal.ZERO;

    @Column(name = "activo")
    private Boolean activo = true;
}