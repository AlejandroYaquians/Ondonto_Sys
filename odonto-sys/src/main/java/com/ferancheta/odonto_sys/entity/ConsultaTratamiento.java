package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "consulta_tratamiento")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultaTratamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consulta_tratamiento")
    private Integer idConsultaTratamiento;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "estado", length = 45)
    private String estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_consulta", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Consulta consulta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tratamiento", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private CatTratamiento tratamiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_servicio")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Servicio servicio;

    @OneToMany(mappedBy = "consultaTratamiento", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<ConsultaInsumo> insumosUsados;
}