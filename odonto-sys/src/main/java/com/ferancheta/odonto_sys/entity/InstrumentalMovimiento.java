package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "instrumental_movimiento")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstrumentalMovimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_instrumental_movimiento")
    private Integer idInstrumentalMovimiento;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @Column(name = "motivo", length = 255)
    private String motivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_instrumental", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Instrumental instrumental;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_movimiento", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private CatMovimiento tipoMovimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Usuario usuario;

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }
}
