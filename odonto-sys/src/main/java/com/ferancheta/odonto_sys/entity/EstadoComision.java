package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estado_comision")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoComision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_comision")
    private Integer idEstadoComision;

    @Column(name = "nombre", nullable = false, length = 45)
    private String nombre;
}
