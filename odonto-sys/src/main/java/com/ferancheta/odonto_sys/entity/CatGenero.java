package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cat_genero")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatGenero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_genero")
    private Integer idGenero;

    @Column(name = "nombre", nullable = false, length = 45)
    private String nombre;

    @Column(name = "activo")
    private Boolean activo = true;
}