package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "comision")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comision")
    private Integer idComision;

    @Column(name = "monto_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoBase = BigDecimal.ZERO;

    @Column(name = "porcentaje_aplicado", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajeAplicado = BigDecimal.ZERO;

    @Column(name = "monto_comision", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoComision = BigDecimal.ZERO;

    @Column(name = "estado", length = 45)
    private String estado = "pendiente";

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_doctor", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cobro", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Cobro cobro;

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_creacion")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Usuario usuarioCreacion;
}