package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cat_afeccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatAfeccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_afeccion")
    private Integer idAfeccion;

    @Column(name = "nombre_afeccion", nullable = false, length = 100)
    private String nombreAfeccion;

    @Column(name = "tipo", length = 45)
    private String tipo;

    @Column(name = "activo")
    private Boolean activo = true;
}