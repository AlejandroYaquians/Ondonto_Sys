package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cat_gasto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatGasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_gasto")
    private Integer idTipoGasto;

    @Column(name = "nombre_categoria", nullable = false, length = 45)
    private String nombreCategoria;

    @Column(name = "tipo", length = 45)
    private String tipo;
}