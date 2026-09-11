package com.ferancheta.odonto_sys.entity;

import com.ferancheta.odonto_sys.entity.base.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "instrumental")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false)
public class Instrumental extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_instrumental")
    private Integer idInstrumental;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "stock_actual")
    private Integer stockActual = 0;

    @Column(name = "stock_minimo")
    private Integer stockMinimo = 0;

    @Column(name = "activo")
    private Boolean activo = true;

    @OneToMany(mappedBy = "instrumental", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<InstrumentalMovimiento> movimientos;
}
