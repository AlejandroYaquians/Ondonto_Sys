package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "insumo_servicio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsumoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insumo_servicio")
    private Integer idInsumoServicio;

    @Column(name = "cantidad_estimada")
    private Integer cantidadEstimada = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_insumo", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Insumo insumo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_servicio", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Servicio servicio;
}