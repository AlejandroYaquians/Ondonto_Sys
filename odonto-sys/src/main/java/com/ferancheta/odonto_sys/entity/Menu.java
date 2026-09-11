package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "menu")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_menu")
    private Integer idMenu;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "ruta", length = 255)
    private String ruta;

    @Column(name = "orden")
    private Integer orden = 0;

    @Column(name = "activo")
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modulo", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Modulo modulo;

    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Permiso> permisos;
}