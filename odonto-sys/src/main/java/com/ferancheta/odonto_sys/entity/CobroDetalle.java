package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cobro_detalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CobroDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_cobro")
    private Integer idDetalleCobro;

    @Column(name = "precio_aplicado", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioAplicado = BigDecimal.ZERO;

    @Column(name = "costo_laboratorio", precision = 10, scale = 2)
    private BigDecimal costoLaboratorio = BigDecimal.ZERO;

    @Column(name = "comision_doctor_calculada", precision = 10, scale = 2)
    private BigDecimal comisionDoctorCalculada = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cobro", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Cobro cobro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_servicio", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Servicio servicio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_metodo_pago", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private CatMetodoPago metodoPago;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_historial_clinico")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private HistorialClinico historialClinico;
}
