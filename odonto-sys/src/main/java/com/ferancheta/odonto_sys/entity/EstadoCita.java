package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estado_cita")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoCita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_cita")
    private Integer idEstadoCita;

    @Column(name = "nombre", nullable = false, length = 45)
    private String nombre;
}