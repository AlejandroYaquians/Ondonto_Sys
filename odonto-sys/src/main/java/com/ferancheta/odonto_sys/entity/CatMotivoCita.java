package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cat_motivo_cita")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatMotivoCita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_motivo_cita")
    private Integer idMotivoCita;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "activo")
    private Boolean activo = true;
}
