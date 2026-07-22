package com.ferancheta.odonto_sys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permiso")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    private Integer idPermiso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Rol rol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_menu", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Menu menu;

    @Column(name = "puede_ver")
    private Boolean puedeVer = false;

    @Column(name = "puede_crear")
    private Boolean puedeCrear = false;

    @Column(name = "puede_editar")
    private Boolean puedeEditar = false;

    @Column(name = "puede_eliminar")
    private Boolean puedeEliminar = false;
}