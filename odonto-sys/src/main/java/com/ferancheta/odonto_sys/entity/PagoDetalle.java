package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "pago_detalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_pago")
    private Integer idDetallePago;

    @Column(name = "precio_aplicado", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioAplicado = BigDecimal.ZERO;

    @Column(name = "costo_laboratorio", precision = 10, scale = 2)
    private BigDecimal costoLaboratorio = BigDecimal.ZERO;

    @Column(name = "comision_doctor_calculada", precision = 10, scale = 2)
    private BigDecimal comisionDoctorCalculada = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pago", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Pago pago;

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
    @JoinColumn(name = "id_consulta_tratamiento", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ConsultaTratamiento consultaTratamiento;
}