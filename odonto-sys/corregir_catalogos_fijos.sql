ALTER TABLE cat_motivo_cita ADD COLUMN activo BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE cat_estado_cita RENAME TO estado_cita;

ALTER TABLE cat_movimiento RENAME TO tipo_movimiento;

INSERT INTO menu (nombre, ruta, orden, activo, id_modulo)
VALUES ('Motivos de Cita', '/catalogos/motivos-cita', 11, true, 5);

INSERT INTO permiso (id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar)
SELECT r.id_rol, m.id_menu, true,
       CASE WHEN r.id_rol = 1 THEN true ELSE false END,
       CASE WHEN r.id_rol = 1 THEN true ELSE false END,
       CASE WHEN r.id_rol = 1 THEN true ELSE false END
FROM rol r
CROSS JOIN menu m
WHERE m.ruta = '/catalogos/motivos-cita';
