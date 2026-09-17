ALTER TABLE comision ADD COLUMN fecha_pago TIMESTAMP NULL;
ALTER TABLE comision ADD COLUMN id_usuario_pago INTEGER NULL REFERENCES usuario(id_usuario);

UPDATE menu SET nombre = 'Pago de Comisiones', ruta = '/financiero/pago-comisiones' WHERE id_menu = 40;

DELETE FROM menu WHERE id_menu = 44;
