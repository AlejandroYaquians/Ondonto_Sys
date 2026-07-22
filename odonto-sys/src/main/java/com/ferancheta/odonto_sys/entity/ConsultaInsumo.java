package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consulta_insumo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultaInsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consulta_insumo")
    private Integer idConsultaInsumo;

    @Column(name = "cantidad_usada", nullable = false)
    private Integer cantidadUsada = 1;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_consulta_tratamiento", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ConsultaTratamiento consultaTratamiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_insumo", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Insumo insumo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_creacion", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Usuario usuarioCreacion;

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }
}