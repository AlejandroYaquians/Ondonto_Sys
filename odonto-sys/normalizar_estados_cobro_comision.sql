CREATE TABLE estado_cobro (
    id_estado_cobro SERIAL PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL UNIQUE
);

INSERT INTO estado_cobro (nombre) VALUES ('Pagado'), ('Anulado');

CREATE TABLE estado_comision (
    id_estado_comision SERIAL PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL UNIQUE
);

INSERT INTO estado_comision (nombre) VALUES ('Pendiente'), ('Pagada');

ALTER TABLE cobro ADD COLUMN id_estado_cobro INTEGER;

UPDATE cobro c
SET id_estado_cobro = e.id_estado_cobro
FROM estado_cobro e
WHERE LOWER(c.estado) = LOWER(e.nombre);

ALTER TABLE cobro ALTER COLUMN id_estado_cobro SET NOT NULL;
ALTER TABLE cobro ADD CONSTRAINT fk_cobro_estado FOREIGN KEY (id_estado_cobro) REFERENCES estado_cobro(id_estado_cobro);
ALTER TABLE cobro DROP COLUMN estado;

ALTER TABLE comision ADD COLUMN id_estado_comision INTEGER;

UPDATE comision c
SET id_estado_comision = e.id_estado_comision
FROM estado_comision e
WHERE LOWER(c.estado) = LOWER(e.nombre);

ALTER TABLE comision ALTER COLUMN id_estado_comision SET NOT NULL;
ALTER TABLE comision ADD CONSTRAINT fk_comision_estado FOREIGN KEY (id_estado_comision) REFERENCES estado_comision(id_estado_comision);
ALTER TABLE comision DROP COLUMN estado;
