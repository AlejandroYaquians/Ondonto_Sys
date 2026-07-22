package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "consulta_diagnostico")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultaDiagnostico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consulta_diagnostico")
    private Integer idConsultaDiagnostico;

    @Column(name = "descripcion_detalle", columnDefinition = "TEXT")
    private String descripcionDetalle;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_consulta", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Consulta consulta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_diagnostico", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private CatDiagnostico diagnostico;
}