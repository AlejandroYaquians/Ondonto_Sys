package com.ferancheta.odonto_sys.entity;

import com.ferancheta.odonto_sys.entity.base.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cobro")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false)
public class Cobro extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cobro")
    private Integer idCobro;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @Column(name = "monto_efectivo", precision = 10, scale = 2)
    private BigDecimal montoEfectivo = BigDecimal.ZERO;

    @Column(name = "monto_tarjeta", precision = 10, scale = 2)
    private BigDecimal montoTarjeta = BigDecimal.ZERO;

    @Column(name = "comision_tarjeta", precision = 10, scale = 2)
    private BigDecimal comisionTarjeta = BigDecimal.ZERO;

    @Column(name = "costo_laboratorio", precision = 10, scale = 2)
    private BigDecimal costoLaboratorio = BigDecimal.ZERO;

    @Column(name = "monto_bruto", precision = 10, scale = 2)
    private BigDecimal montoBruto = BigDecimal.ZERO;

    @Column(name = "monto_neto", precision = 10, scale = 2)
    private BigDecimal montoNeto = BigDecimal.ZERO;

    @Column(name = "codigo_cobro")
    private Long codigoCobro;

    @Column(name = "estado", length = 45)
    private String estado = "pendiente";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cita")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Cita cita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_metodo_pago", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private CatMetodoPago metodoPago;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Usuario usuario;

    @OneToMany(mappedBy = "cobro", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<CobroDetalle> detalles;

    @OneToMany(mappedBy = "cobro", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Comision> comisiones;

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }
}
