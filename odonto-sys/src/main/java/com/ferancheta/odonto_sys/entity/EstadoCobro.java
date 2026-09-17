package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estado_cobro")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoCobro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_cobro")
    private Integer idEstadoCobro;

    @Column(name = "nombre", nullable = false, length = 45)
    private String nombre;
}
