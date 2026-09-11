package com.ferancheta.odonto_sys.entity.base;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
public abstract class AuditableEntity {

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "fecha_modificacion")
    private LocalDateTime updatedAt;

    @Column(name = "id_usuario_creacion")
    private Integer idUsuarioCreacion;

    @Column(name = "id_usuario_modificacion")
    private Integer idUsuarioModificacion;
}