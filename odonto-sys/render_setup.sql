-- ============================================================
-- ESQUEMA COMPLETO (tablas, secuencias, triggers, funciones, FKs)
-- ============================================================
--
-- PostgreSQL database dump
--


-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: fn_fecha_modificacion(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_fecha_modificacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: antecedente_medico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.antecedente_medico (
    id_antecedente integer CONSTRAINT historial_medico_id_historial_not_null NOT NULL,
    observacion_detalle character varying(255),
    fecha_registro date CONSTRAINT historial_medico_fecha_registro_not_null NOT NULL,
    id_paciente integer CONSTRAINT historial_medico_id_paciente_not_null NOT NULL,
    id_afeccion integer CONSTRAINT historial_medico_id_afeccion_not_null NOT NULL
);


--
-- Name: bitacora; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bitacora (
    id_bitacora integer NOT NULL,
    tabla_afectada character varying(50) NOT NULL,
    id_registro integer NOT NULL,
    accion character varying(10) NOT NULL,
    campo_modificado character varying(50),
    valor_anterior text,
    valor_nuevo text,
    fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ip_origen character varying(45),
    id_usuario integer
);


--
-- Name: bitacora_id_bitacora_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bitacora_id_bitacora_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bitacora_id_bitacora_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bitacora_id_bitacora_seq OWNED BY public.bitacora.id_bitacora;


--
-- Name: cat_afeccion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_afeccion (
    id_afeccion integer NOT NULL,
    nombre_afeccion character varying(100) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: cat_afeccion_id_afeccion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_afeccion_id_afeccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_afeccion_id_afeccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_afeccion_id_afeccion_seq OWNED BY public.cat_afeccion.id_afeccion;


--
-- Name: cat_especialidad; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_especialidad (
    id_especialidad integer NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: cat_especialidad_id_especialidad_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_especialidad_id_especialidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_especialidad_id_especialidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_especialidad_id_especialidad_seq OWNED BY public.cat_especialidad.id_especialidad;


--
-- Name: estado_cita; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estado_cita (
    id_estado_cita integer CONSTRAINT cat_estado_cita_id_estado_cita_not_null NOT NULL,
    nombre character varying(45) CONSTRAINT cat_estado_cita_nombre_not_null NOT NULL
);


--
-- Name: cat_estado_cita_id_estado_cita_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_estado_cita_id_estado_cita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_estado_cita_id_estado_cita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_estado_cita_id_estado_cita_seq OWNED BY public.estado_cita.id_estado_cita;


--
-- Name: cat_gasto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_gasto (
    id_tipo_gasto integer NOT NULL,
    nombre_categoria character varying(45) NOT NULL,
    tipo character varying(45),
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: cat_gasto_id_tipo_gasto_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_gasto_id_tipo_gasto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_gasto_id_tipo_gasto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_gasto_id_tipo_gasto_seq OWNED BY public.cat_gasto.id_tipo_gasto;


--
-- Name: cat_genero; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_genero (
    id_genero integer NOT NULL,
    nombre character varying(45) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: cat_genero_id_genero_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_genero_id_genero_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_genero_id_genero_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_genero_id_genero_seq OWNED BY public.cat_genero.id_genero;


--
-- Name: cat_metodo_pago; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_metodo_pago (
    id_metodo_pago integer NOT NULL,
    nombre character varying(45) NOT NULL,
    comision_porcentaje numeric(5,2) DEFAULT 0.00
);


--
-- Name: cat_metodo_pago_id_metodo_pago_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_metodo_pago_id_metodo_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_metodo_pago_id_metodo_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_metodo_pago_id_metodo_pago_seq OWNED BY public.cat_metodo_pago.id_metodo_pago;


--
-- Name: cat_motivo_cita; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_motivo_cita (
    id_motivo_cita integer NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: cat_motivo_cita_id_motivo_cita_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_motivo_cita_id_motivo_cita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_motivo_cita_id_motivo_cita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_motivo_cita_id_motivo_cita_seq OWNED BY public.cat_motivo_cita.id_motivo_cita;


--
-- Name: tipo_movimiento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_movimiento (
    id_tipo_movimiento integer CONSTRAINT cat_movimiento_id_tipo_movimiento_not_null NOT NULL,
    nombre_movimiento character varying(45) CONSTRAINT cat_movimiento_nombre_movimiento_not_null NOT NULL,
    operacion boolean CONSTRAINT cat_movimiento_operacion_not_null NOT NULL
);


--
-- Name: cat_movimiento_id_tipo_movimiento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_movimiento_id_tipo_movimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_movimiento_id_tipo_movimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_movimiento_id_tipo_movimiento_seq OWNED BY public.tipo_movimiento.id_tipo_movimiento;


--
-- Name: cat_parentesco; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_parentesco (
    id_parentesco integer NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: cat_parentesco_id_parentesco_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_parentesco_id_parentesco_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_parentesco_id_parentesco_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_parentesco_id_parentesco_seq OWNED BY public.cat_parentesco.id_parentesco;


--
-- Name: cat_profesion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_profesion (
    id_profesion integer NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: cat_profesion_id_profesion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cat_profesion_id_profesion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_profesion_id_profesion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cat_profesion_id_profesion_seq OWNED BY public.cat_profesion.id_profesion;


--
-- Name: cat_servicio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_servicio (
    id_servicio integer CONSTRAINT servicio_id_servicio_not_null NOT NULL,
    nombre character varying(100) CONSTRAINT servicio_nombre_not_null NOT NULL,
    descripcion character varying(255),
    costo_base numeric(10,2) DEFAULT 0.00 CONSTRAINT servicio_costo_base_not_null NOT NULL,
    activo boolean DEFAULT true
);


--
-- Name: cita; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cita (
    id_cita integer NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    id_paciente integer NOT NULL,
    id_doctor integer NOT NULL,
    id_estado_cita integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creacion integer,
    id_usuario_modificacion integer,
    id_motivo_cita integer NOT NULL,
    observaciones text
);


--
-- Name: cita_id_cita_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cita_id_cita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cita_id_cita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cita_id_cita_seq OWNED BY public.cita.id_cita;


--
-- Name: cobro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cobro (
    id_cobro integer CONSTRAINT pago_id_pago_not_null NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    monto_efectivo numeric(10,2) DEFAULT 0.00,
    monto_tarjeta numeric(10,2) DEFAULT 0.00,
    monto_transferencia numeric(10,2) DEFAULT 0.00 NOT NULL,
    comision_tarjeta numeric(10,2) DEFAULT 0.00,
    costo_laboratorio numeric(10,2) DEFAULT 0.00,
    monto_bruto numeric(10,2) DEFAULT 0.00,
    monto_neto numeric(10,2) DEFAULT 0.00,
    codigo_cobro bigint,
    id_paciente integer CONSTRAINT pago_id_paciente_not_null NOT NULL,
    id_cita integer,
    id_metodo_pago integer CONSTRAINT pago_id_metodo_pago_not_null NOT NULL,
    id_usuario integer CONSTRAINT pago_id_usuario_not_null NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creacion integer,
    id_usuario_modificacion integer,
    id_estado_cobro integer NOT NULL
);


--
-- Name: cobro_detalle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cobro_detalle (
    id_detalle_cobro integer CONSTRAINT pago_detalle_id_detalle_pago_not_null NOT NULL,
    precio_aplicado numeric(10,2) DEFAULT 0.00 CONSTRAINT pago_detalle_precio_aplicado_not_null NOT NULL,
    costo_laboratorio numeric(10,2) DEFAULT 0.00,
    comision_doctor_calculada numeric(10,2) DEFAULT 0.00,
    id_cobro integer CONSTRAINT pago_detalle_id_pago_not_null NOT NULL,
    id_servicio integer CONSTRAINT pago_detalle_id_servicio_not_null NOT NULL,
    id_metodo_pago integer CONSTRAINT pago_detalle_id_metodo_pago_not_null NOT NULL,
    id_historial_clinico integer
);


--
-- Name: comision; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comision (
    id_comision integer NOT NULL,
    monto_base numeric(10,2) DEFAULT 0.00 NOT NULL,
    porcentaje_aplicado numeric(5,2) DEFAULT 0.00 NOT NULL,
    monto_comision numeric(10,2) DEFAULT 0.00 NOT NULL,
    fecha date NOT NULL,
    id_doctor integer NOT NULL,
    id_cobro integer CONSTRAINT comision_id_pago_not_null NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creacion integer,
    id_pago_comision integer
);


--
-- Name: comision_id_comision_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comision_id_comision_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comision_id_comision_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comision_id_comision_seq OWNED BY public.comision.id_comision;


--
-- Name: contacto_paciente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contacto_paciente (
    id_contacto integer NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    telefono_contacto character varying(15),
    id_paciente integer NOT NULL,
    id_parentesco integer
);


--
-- Name: contacto_paciente_id_contacto_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contacto_paciente_id_contacto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contacto_paciente_id_contacto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contacto_paciente_id_contacto_seq OWNED BY public.contacto_paciente.id_contacto;


--
-- Name: departamento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departamento (
    id_departamento integer NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: departamento_id_departamento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departamento_id_departamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departamento_id_departamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departamento_id_departamento_seq OWNED BY public.departamento.id_departamento;


--
-- Name: doctor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctor (
    id_doctor integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    telefono character varying(15),
    email character varying(100),
    porcentaje_comision numeric(5,2) DEFAULT 0.00 NOT NULL,
    activo boolean DEFAULT true,
    id_usuario integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creacion integer,
    id_usuario_modificacion integer
);


--
-- Name: doctor_especialidad; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctor_especialidad (
    id_doctor_especialidad integer NOT NULL,
    id_doctor integer NOT NULL,
    id_especialidad integer NOT NULL
);


--
-- Name: doctor_especialidad_id_doctor_especialidad_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.doctor_especialidad_id_doctor_especialidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: doctor_especialidad_id_doctor_especialidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.doctor_especialidad_id_doctor_especialidad_seq OWNED BY public.doctor_especialidad.id_doctor_especialidad;


--
-- Name: doctor_id_doctor_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.doctor_id_doctor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: doctor_id_doctor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.doctor_id_doctor_seq OWNED BY public.doctor.id_doctor;


--
-- Name: estado_cobro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estado_cobro (
    id_estado_cobro integer NOT NULL,
    nombre character varying(45) NOT NULL
);


--
-- Name: estado_cobro_id_estado_cobro_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estado_cobro_id_estado_cobro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: estado_cobro_id_estado_cobro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estado_cobro_id_estado_cobro_seq OWNED BY public.estado_cobro.id_estado_cobro;


--
-- Name: gasto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gasto (
    id_gasto integer NOT NULL,
    descripcion character varying(100) NOT NULL,
    monto numeric(10,2) DEFAULT 0.00 NOT NULL,
    fecha date NOT NULL,
    comprobante character varying(100),
    id_tipo_gasto integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: gasto_id_gasto_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gasto_id_gasto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gasto_id_gasto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gasto_id_gasto_seq OWNED BY public.gasto.id_gasto;


--
-- Name: historial_clinico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.historial_clinico (
    id_historial_clinico integer NOT NULL,
    fecha timestamp without time zone NOT NULL,
    descripcion text NOT NULL,
    id_cita integer,
    id_paciente integer NOT NULL,
    id_doctor integer NOT NULL,
    id_usuario_creacion integer,
    id_usuario_modificacion integer,
    fecha_creacion timestamp without time zone DEFAULT now() CONSTRAINT historial_clinico_created_at_not_null NOT NULL,
    fecha_modificacion timestamp without time zone
);


--
-- Name: historial_clinico_id_historial_clinico_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.historial_clinico_id_historial_clinico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: historial_clinico_id_historial_clinico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.historial_clinico_id_historial_clinico_seq OWNED BY public.historial_clinico.id_historial_clinico;


--
-- Name: historial_medico_id_historial_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.historial_medico_id_historial_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: historial_medico_id_historial_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.historial_medico_id_historial_seq OWNED BY public.antecedente_medico.id_antecedente;


--
-- Name: instrumental; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.instrumental (
    id_instrumental integer CONSTRAINT insumo_id_insumo_not_null NOT NULL,
    nombre character varying(100) CONSTRAINT insumo_nombre_not_null NOT NULL,
    descripcion character varying(255),
    stock_actual integer DEFAULT 0,
    stock_minimo integer DEFAULT 0,
    activo boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creacion integer,
    id_usuario_modificacion integer
);


--
-- Name: instrumental_movimiento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.instrumental_movimiento (
    id_instrumental_movimiento integer CONSTRAINT insumo_movimiento_id_movimiento_not_null NOT NULL,
    cantidad integer CONSTRAINT insumo_movimiento_cantidad_not_null NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    motivo character varying(255),
    id_instrumental integer CONSTRAINT insumo_movimiento_id_insumo_not_null NOT NULL,
    id_tipo_movimiento integer CONSTRAINT insumo_movimiento_id_tipo_movimiento_not_null NOT NULL,
    id_usuario integer CONSTRAINT insumo_movimiento_id_usuario_not_null NOT NULL
);


--
-- Name: insumo_id_insumo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.insumo_id_insumo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: insumo_id_insumo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.insumo_id_insumo_seq OWNED BY public.instrumental.id_instrumental;


--
-- Name: insumo_movimiento_id_movimiento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.insumo_movimiento_id_movimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: insumo_movimiento_id_movimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.insumo_movimiento_id_movimiento_seq OWNED BY public.instrumental_movimiento.id_instrumental_movimiento;


--
-- Name: menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu (
    id_menu integer NOT NULL,
    nombre character varying(100) NOT NULL,
    ruta character varying(255),
    orden integer DEFAULT 0,
    activo boolean DEFAULT true,
    id_modulo integer NOT NULL
);


--
-- Name: menu_id_menu_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.menu_id_menu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: menu_id_menu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.menu_id_menu_seq OWNED BY public.menu.id_menu;


--
-- Name: modulo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modulo (
    id_modulo integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255)
);


--
-- Name: modulo_id_modulo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.modulo_id_modulo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: modulo_id_modulo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.modulo_id_modulo_seq OWNED BY public.modulo.id_modulo;


--
-- Name: municipio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.municipio (
    id_municipio integer NOT NULL,
    nombre character varying(100) NOT NULL,
    id_departamento integer NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: municipio_id_municipio_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.municipio_id_municipio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: municipio_id_municipio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.municipio_id_municipio_seq OWNED BY public.municipio.id_municipio;


--
-- Name: pago_comision; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pago_comision (
    id_pago_comision integer NOT NULL,
    id_doctor integer NOT NULL,
    fecha_pago timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    monto_total numeric(10,2) DEFAULT 0.00 NOT NULL,
    numero_referencia character varying(50),
    id_usuario_pago integer NOT NULL
);


--
-- Name: pago_comision_id_pago_comision_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pago_comision_id_pago_comision_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pago_comision_id_pago_comision_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pago_comision_id_pago_comision_seq OWNED BY public.pago_comision.id_pago_comision;


--
-- Name: paciente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.paciente (
    id_paciente integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    fecha_nacimiento date,
    telefono character varying(15),
    email character varying(100),
    direccion character varying(255),
    referido_por character varying(100),
    medico_familia character varying(100),
    activo boolean DEFAULT true,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_genero integer,
    id_profesion integer,
    id_municipio integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario_creacion integer,
    id_usuario_modificacion integer
);


--
-- Name: paciente_id_paciente_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.paciente_id_paciente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: paciente_id_paciente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.paciente_id_paciente_seq OWNED BY public.paciente.id_paciente;


--
-- Name: pago_detalle_id_detalle_pago_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pago_detalle_id_detalle_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pago_detalle_id_detalle_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pago_detalle_id_detalle_pago_seq OWNED BY public.cobro_detalle.id_detalle_cobro;


--
-- Name: pago_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pago_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pago_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pago_id_pago_seq OWNED BY public.cobro.id_cobro;


--
-- Name: permiso; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permiso (
    id_permiso integer NOT NULL,
    id_rol integer NOT NULL,
    id_menu integer NOT NULL,
    puede_ver boolean DEFAULT false,
    puede_crear boolean DEFAULT false,
    puede_editar boolean DEFAULT false,
    puede_eliminar boolean DEFAULT false
);


--
-- Name: permiso_id_permiso_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permiso_id_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permiso_id_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permiso_id_permiso_seq OWNED BY public.permiso.id_permiso;


--
-- Name: receta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.receta (
    id_receta integer NOT NULL,
    medicamento character varying(255) NOT NULL,
    dosis character varying(100),
    frecuencia character varying(100),
    duracion character varying(100),
    indicaciones text,
    fecha date NOT NULL,
    id_historial_clinico integer NOT NULL
);


--
-- Name: receta_id_receta_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.receta_id_receta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: receta_id_receta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.receta_id_receta_seq OWNED BY public.receta.id_receta;


--
-- Name: rol; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    nombre character varying(45) NOT NULL,
    descripcion character varying(255)
);


--
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rol_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rol_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rol_id_rol_seq OWNED BY public.rol.id_rol;


--
-- Name: servicio_id_servicio_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servicio_id_servicio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicio_id_servicio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servicio_id_servicio_seq OWNED BY public.cat_servicio.id_servicio;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre character varying(100) NOT NULL,
    username character varying(45) NOT NULL,
    password_hash character varying(255) NOT NULL,
    estado boolean DEFAULT true,
    id_rol integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    apellido character varying(100),
    intentos_fallidos integer DEFAULT 0 NOT NULL,
    bloqueado_hasta timestamp without time zone
);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- Name: antecedente_medico id_antecedente; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedente_medico ALTER COLUMN id_antecedente SET DEFAULT nextval('public.historial_medico_id_historial_seq'::regclass);


--
-- Name: bitacora id_bitacora; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacora ALTER COLUMN id_bitacora SET DEFAULT nextval('public.bitacora_id_bitacora_seq'::regclass);


--
-- Name: cat_afeccion id_afeccion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_afeccion ALTER COLUMN id_afeccion SET DEFAULT nextval('public.cat_afeccion_id_afeccion_seq'::regclass);


--
-- Name: cat_especialidad id_especialidad; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_especialidad ALTER COLUMN id_especialidad SET DEFAULT nextval('public.cat_especialidad_id_especialidad_seq'::regclass);


--
-- Name: cat_gasto id_tipo_gasto; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_gasto ALTER COLUMN id_tipo_gasto SET DEFAULT nextval('public.cat_gasto_id_tipo_gasto_seq'::regclass);


--
-- Name: cat_genero id_genero; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_genero ALTER COLUMN id_genero SET DEFAULT nextval('public.cat_genero_id_genero_seq'::regclass);


--
-- Name: cat_metodo_pago id_metodo_pago; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_metodo_pago ALTER COLUMN id_metodo_pago SET DEFAULT nextval('public.cat_metodo_pago_id_metodo_pago_seq'::regclass);


--
-- Name: cat_motivo_cita id_motivo_cita; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_motivo_cita ALTER COLUMN id_motivo_cita SET DEFAULT nextval('public.cat_motivo_cita_id_motivo_cita_seq'::regclass);


--
-- Name: cat_parentesco id_parentesco; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_parentesco ALTER COLUMN id_parentesco SET DEFAULT nextval('public.cat_parentesco_id_parentesco_seq'::regclass);


--
-- Name: cat_profesion id_profesion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_profesion ALTER COLUMN id_profesion SET DEFAULT nextval('public.cat_profesion_id_profesion_seq'::regclass);


--
-- Name: cat_servicio id_servicio; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_servicio ALTER COLUMN id_servicio SET DEFAULT nextval('public.servicio_id_servicio_seq'::regclass);


--
-- Name: cita id_cita; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita ALTER COLUMN id_cita SET DEFAULT nextval('public.cita_id_cita_seq'::regclass);


--
-- Name: cobro id_cobro; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro ALTER COLUMN id_cobro SET DEFAULT nextval('public.pago_id_pago_seq'::regclass);


--
-- Name: cobro_detalle id_detalle_cobro; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro_detalle ALTER COLUMN id_detalle_cobro SET DEFAULT nextval('public.pago_detalle_id_detalle_pago_seq'::regclass);


--
-- Name: comision id_comision; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comision ALTER COLUMN id_comision SET DEFAULT nextval('public.comision_id_comision_seq'::regclass);


--
-- Name: contacto_paciente id_contacto; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacto_paciente ALTER COLUMN id_contacto SET DEFAULT nextval('public.contacto_paciente_id_contacto_seq'::regclass);


--
-- Name: departamento id_departamento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departamento ALTER COLUMN id_departamento SET DEFAULT nextval('public.departamento_id_departamento_seq'::regclass);


--
-- Name: doctor id_doctor; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor ALTER COLUMN id_doctor SET DEFAULT nextval('public.doctor_id_doctor_seq'::regclass);


--
-- Name: doctor_especialidad id_doctor_especialidad; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_especialidad ALTER COLUMN id_doctor_especialidad SET DEFAULT nextval('public.doctor_especialidad_id_doctor_especialidad_seq'::regclass);


--
-- Name: estado_cita id_estado_cita; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_cita ALTER COLUMN id_estado_cita SET DEFAULT nextval('public.cat_estado_cita_id_estado_cita_seq'::regclass);


--
-- Name: estado_cobro id_estado_cobro; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_cobro ALTER COLUMN id_estado_cobro SET DEFAULT nextval('public.estado_cobro_id_estado_cobro_seq'::regclass);


--
-- Name: gasto id_gasto; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gasto ALTER COLUMN id_gasto SET DEFAULT nextval('public.gasto_id_gasto_seq'::regclass);


--
-- Name: historial_clinico id_historial_clinico; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_clinico ALTER COLUMN id_historial_clinico SET DEFAULT nextval('public.historial_clinico_id_historial_clinico_seq'::regclass);


--
-- Name: instrumental id_instrumental; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumental ALTER COLUMN id_instrumental SET DEFAULT nextval('public.insumo_id_insumo_seq'::regclass);


--
-- Name: instrumental_movimiento id_instrumental_movimiento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumental_movimiento ALTER COLUMN id_instrumental_movimiento SET DEFAULT nextval('public.insumo_movimiento_id_movimiento_seq'::regclass);


--
-- Name: menu id_menu; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu ALTER COLUMN id_menu SET DEFAULT nextval('public.menu_id_menu_seq'::regclass);


--
-- Name: modulo id_modulo; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modulo ALTER COLUMN id_modulo SET DEFAULT nextval('public.modulo_id_modulo_seq'::regclass);


--
-- Name: municipio id_municipio; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.municipio ALTER COLUMN id_municipio SET DEFAULT nextval('public.municipio_id_municipio_seq'::regclass);


--
-- Name: pago_comision id_pago_comision; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago_comision ALTER COLUMN id_pago_comision SET DEFAULT nextval('public.pago_comision_id_pago_comision_seq'::regclass);


--
-- Name: paciente id_paciente; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente ALTER COLUMN id_paciente SET DEFAULT nextval('public.paciente_id_paciente_seq'::regclass);


--
-- Name: permiso id_permiso; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso ALTER COLUMN id_permiso SET DEFAULT nextval('public.permiso_id_permiso_seq'::regclass);


--
-- Name: receta id_receta; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.receta ALTER COLUMN id_receta SET DEFAULT nextval('public.receta_id_receta_seq'::regclass);


--
-- Name: rol id_rol; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol ALTER COLUMN id_rol SET DEFAULT nextval('public.rol_id_rol_seq'::regclass);


--
-- Name: tipo_movimiento id_tipo_movimiento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_movimiento ALTER COLUMN id_tipo_movimiento SET DEFAULT nextval('public.cat_movimiento_id_tipo_movimiento_seq'::regclass);


--
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- Name: bitacora bitacora_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_pkey PRIMARY KEY (id_bitacora);


--
-- Name: cat_afeccion cat_afeccion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_afeccion
    ADD CONSTRAINT cat_afeccion_pkey PRIMARY KEY (id_afeccion);


--
-- Name: cat_especialidad cat_especialidad_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_especialidad
    ADD CONSTRAINT cat_especialidad_pkey PRIMARY KEY (id_especialidad);


--
-- Name: estado_cita cat_estado_cita_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_cita
    ADD CONSTRAINT cat_estado_cita_pkey PRIMARY KEY (id_estado_cita);


--
-- Name: cat_gasto cat_gasto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_gasto
    ADD CONSTRAINT cat_gasto_pkey PRIMARY KEY (id_tipo_gasto);


--
-- Name: cat_genero cat_genero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_genero
    ADD CONSTRAINT cat_genero_pkey PRIMARY KEY (id_genero);


--
-- Name: cat_metodo_pago cat_metodo_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_metodo_pago
    ADD CONSTRAINT cat_metodo_pago_pkey PRIMARY KEY (id_metodo_pago);


--
-- Name: cat_motivo_cita cat_motivo_cita_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_motivo_cita
    ADD CONSTRAINT cat_motivo_cita_pkey PRIMARY KEY (id_motivo_cita);


--
-- Name: tipo_movimiento cat_movimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_movimiento
    ADD CONSTRAINT cat_movimiento_pkey PRIMARY KEY (id_tipo_movimiento);


--
-- Name: cat_parentesco cat_parentesco_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_parentesco
    ADD CONSTRAINT cat_parentesco_pkey PRIMARY KEY (id_parentesco);


--
-- Name: cat_profesion cat_profesion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_profesion
    ADD CONSTRAINT cat_profesion_pkey PRIMARY KEY (id_profesion);


--
-- Name: cita cita_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_pkey PRIMARY KEY (id_cita);


--
-- Name: comision comision_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comision
    ADD CONSTRAINT comision_pkey PRIMARY KEY (id_comision);


--
-- Name: contacto_paciente contacto_paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacto_paciente
    ADD CONSTRAINT contacto_paciente_pkey PRIMARY KEY (id_contacto);


--
-- Name: departamento departamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departamento
    ADD CONSTRAINT departamento_pkey PRIMARY KEY (id_departamento);


--
-- Name: doctor_especialidad doctor_especialidad_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_especialidad
    ADD CONSTRAINT doctor_especialidad_pkey PRIMARY KEY (id_doctor_especialidad);


--
-- Name: doctor doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_pkey PRIMARY KEY (id_doctor);


--
-- Name: estado_cobro estado_cobro_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_cobro
    ADD CONSTRAINT estado_cobro_nombre_key UNIQUE (nombre);


--
-- Name: estado_cobro estado_cobro_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_cobro
    ADD CONSTRAINT estado_cobro_pkey PRIMARY KEY (id_estado_cobro);


--
-- Name: gasto gasto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gasto
    ADD CONSTRAINT gasto_pkey PRIMARY KEY (id_gasto);


--
-- Name: historial_clinico historial_clinico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_pkey PRIMARY KEY (id_historial_clinico);


--
-- Name: antecedente_medico historial_medico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedente_medico
    ADD CONSTRAINT historial_medico_pkey PRIMARY KEY (id_antecedente);


--
-- Name: instrumental_movimiento insumo_movimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumental_movimiento
    ADD CONSTRAINT insumo_movimiento_pkey PRIMARY KEY (id_instrumental_movimiento);


--
-- Name: instrumental insumo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumental
    ADD CONSTRAINT insumo_pkey PRIMARY KEY (id_instrumental);


--
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id_menu);


--
-- Name: modulo modulo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modulo
    ADD CONSTRAINT modulo_pkey PRIMARY KEY (id_modulo);


--
-- Name: municipio municipio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.municipio
    ADD CONSTRAINT municipio_pkey PRIMARY KEY (id_municipio);


--
-- Name: pago_comision pago_comision_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago_comision
    ADD CONSTRAINT pago_comision_pkey PRIMARY KEY (id_pago_comision);


--
-- Name: paciente paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (id_paciente);


--
-- Name: cobro_detalle pago_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro_detalle
    ADD CONSTRAINT pago_detalle_pkey PRIMARY KEY (id_detalle_cobro);


--
-- Name: cobro pago_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_cobro);


--
-- Name: permiso permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (id_permiso);


--
-- Name: receta receta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_pkey PRIMARY KEY (id_receta);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- Name: cat_servicio servicio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_servicio
    ADD CONSTRAINT servicio_pkey PRIMARY KEY (id_servicio);


--
-- Name: doctor_especialidad uq_doctor_especialidad; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_especialidad
    ADD CONSTRAINT uq_doctor_especialidad UNIQUE (id_doctor, id_especialidad);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: usuario usuario_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_username_key UNIQUE (username);


--
-- Name: cita trg_cita_fecha_modificacion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_cita_fecha_modificacion BEFORE UPDATE ON public.cita FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_modificacion();


--
-- Name: doctor trg_doctor_fecha_modificacion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_doctor_fecha_modificacion BEFORE UPDATE ON public.doctor FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_modificacion();


--
-- Name: gasto trg_gasto_fecha_modificacion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_gasto_fecha_modificacion BEFORE UPDATE ON public.gasto FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_modificacion();


--
-- Name: instrumental trg_insumo_fecha_modificacion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_insumo_fecha_modificacion BEFORE UPDATE ON public.instrumental FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_modificacion();


--
-- Name: paciente trg_paciente_fecha_modificacion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_paciente_fecha_modificacion BEFORE UPDATE ON public.paciente FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_modificacion();


--
-- Name: cobro trg_pago_fecha_modificacion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_pago_fecha_modificacion BEFORE UPDATE ON public.cobro FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_modificacion();


--
-- Name: usuario trg_usuario_fecha_modificacion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_usuario_fecha_modificacion BEFORE UPDATE ON public.usuario FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_modificacion();


--
-- Name: cita cita_id_motivo_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_motivo_cita_fkey FOREIGN KEY (id_motivo_cita) REFERENCES public.cat_motivo_cita(id_motivo_cita);


--
-- Name: cobro_detalle cobro_detalle_id_historial_clinico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro_detalle
    ADD CONSTRAINT cobro_detalle_id_historial_clinico_fkey FOREIGN KEY (id_historial_clinico) REFERENCES public.historial_clinico(id_historial_clinico);


--
-- Name: bitacora fk_bitacora_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT fk_bitacora_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: cita fk_cita_creacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_creacion FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario);


--
-- Name: cita fk_cita_doctor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_doctor FOREIGN KEY (id_doctor) REFERENCES public.doctor(id_doctor);


--
-- Name: cita fk_cita_estado; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_estado FOREIGN KEY (id_estado_cita) REFERENCES public.estado_cita(id_estado_cita);


--
-- Name: cita fk_cita_modificacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_modificacion FOREIGN KEY (id_usuario_modificacion) REFERENCES public.usuario(id_usuario);


--
-- Name: cita fk_cita_paciente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_paciente FOREIGN KEY (id_paciente) REFERENCES public.paciente(id_paciente);


--
-- Name: cita fk_cita_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT fk_cita_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: cobro fk_cobro_estado; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro
    ADD CONSTRAINT fk_cobro_estado FOREIGN KEY (id_estado_cobro) REFERENCES public.estado_cobro(id_estado_cobro);


--
-- Name: comision fk_comision_doctor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comision
    ADD CONSTRAINT fk_comision_doctor FOREIGN KEY (id_doctor) REFERENCES public.doctor(id_doctor);


--
-- Name: comision fk_comision_pago; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comision
    ADD CONSTRAINT fk_comision_pago FOREIGN KEY (id_cobro) REFERENCES public.cobro(id_cobro);


--
-- Name: comision fk_comision_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comision
    ADD CONSTRAINT fk_comision_usuario FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario);


--
-- Name: comision fk_comision_pago_comision; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comision
    ADD CONSTRAINT fk_comision_pago_comision FOREIGN KEY (id_pago_comision) REFERENCES public.pago_comision(id_pago_comision);


--
-- Name: pago_comision fk_pago_comision_doctor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago_comision
    ADD CONSTRAINT fk_pago_comision_doctor FOREIGN KEY (id_doctor) REFERENCES public.doctor(id_doctor);


--
-- Name: pago_comision fk_pago_comision_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago_comision
    ADD CONSTRAINT fk_pago_comision_usuario FOREIGN KEY (id_usuario_pago) REFERENCES public.usuario(id_usuario);


--
-- Name: contacto_paciente fk_contacto_paciente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacto_paciente
    ADD CONSTRAINT fk_contacto_paciente FOREIGN KEY (id_paciente) REFERENCES public.paciente(id_paciente);


--
-- Name: contacto_paciente fk_contacto_parentesco; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacto_paciente
    ADD CONSTRAINT fk_contacto_parentesco FOREIGN KEY (id_parentesco) REFERENCES public.cat_parentesco(id_parentesco);


--
-- Name: doctor_especialidad fk_de_doctor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_especialidad
    ADD CONSTRAINT fk_de_doctor FOREIGN KEY (id_doctor) REFERENCES public.doctor(id_doctor);


--
-- Name: doctor_especialidad fk_de_especialidad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_especialidad
    ADD CONSTRAINT fk_de_especialidad FOREIGN KEY (id_especialidad) REFERENCES public.cat_especialidad(id_especialidad);


--
-- Name: doctor fk_doctor_creacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT fk_doctor_creacion FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario);


--
-- Name: doctor fk_doctor_modificacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT fk_doctor_modificacion FOREIGN KEY (id_usuario_modificacion) REFERENCES public.usuario(id_usuario);


--
-- Name: doctor fk_doctor_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT fk_doctor_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: gasto fk_gasto_tipo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gasto
    ADD CONSTRAINT fk_gasto_tipo FOREIGN KEY (id_tipo_gasto) REFERENCES public.cat_gasto(id_tipo_gasto);


--
-- Name: gasto fk_gasto_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gasto
    ADD CONSTRAINT fk_gasto_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: antecedente_medico fk_historial_afeccion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedente_medico
    ADD CONSTRAINT fk_historial_afeccion FOREIGN KEY (id_afeccion) REFERENCES public.cat_afeccion(id_afeccion);


--
-- Name: antecedente_medico fk_historial_paciente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedente_medico
    ADD CONSTRAINT fk_historial_paciente FOREIGN KEY (id_paciente) REFERENCES public.paciente(id_paciente);


--
-- Name: instrumental fk_insumo_creacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumental
    ADD CONSTRAINT fk_insumo_creacion FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario);


--
-- Name: instrumental fk_insumo_modificacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumental
    ADD CONSTRAINT fk_insumo_modificacion FOREIGN KEY (id_usuario_modificacion) REFERENCES public.usuario(id_usuario);


--
-- Name: menu fk_menu_modulo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT fk_menu_modulo FOREIGN KEY (id_modulo) REFERENCES public.modulo(id_modulo);


--
-- Name: instrumental_movimiento fk_movimiento_insumo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumental_movimiento
    ADD CONSTRAINT fk_movimiento_insumo FOREIGN KEY (id_instrumental) REFERENCES public.instrumental(id_instrumental);


--
-- Name: instrumental_movimiento fk_movimiento_tipo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumental_movimiento
    ADD CONSTRAINT fk_movimiento_tipo FOREIGN KEY (id_tipo_movimiento) REFERENCES public.tipo_movimiento(id_tipo_movimiento);


--
-- Name: instrumental_movimiento fk_movimiento_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instrumental_movimiento
    ADD CONSTRAINT fk_movimiento_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: municipio fk_municipio_departamento; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.municipio
    ADD CONSTRAINT fk_municipio_departamento FOREIGN KEY (id_departamento) REFERENCES public.departamento(id_departamento);


--
-- Name: paciente fk_paciente_creacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_creacion FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario);


--
-- Name: paciente fk_paciente_genero; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_genero FOREIGN KEY (id_genero) REFERENCES public.cat_genero(id_genero);


--
-- Name: paciente fk_paciente_modificacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_modificacion FOREIGN KEY (id_usuario_modificacion) REFERENCES public.usuario(id_usuario);


--
-- Name: paciente fk_paciente_municipio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_municipio FOREIGN KEY (id_municipio) REFERENCES public.municipio(id_municipio);


--
-- Name: paciente fk_paciente_profesion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_profesion FOREIGN KEY (id_profesion) REFERENCES public.cat_profesion(id_profesion);


--
-- Name: cobro fk_pago_cita; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro
    ADD CONSTRAINT fk_pago_cita FOREIGN KEY (id_cita) REFERENCES public.cita(id_cita);


--
-- Name: cobro_detalle fk_pago_detalle_metodo_pago; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro_detalle
    ADD CONSTRAINT fk_pago_detalle_metodo_pago FOREIGN KEY (id_metodo_pago) REFERENCES public.cat_metodo_pago(id_metodo_pago);


--
-- Name: cobro_detalle fk_pago_detalle_pago; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro_detalle
    ADD CONSTRAINT fk_pago_detalle_pago FOREIGN KEY (id_cobro) REFERENCES public.cobro(id_cobro);


--
-- Name: cobro_detalle fk_pago_detalle_servicio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro_detalle
    ADD CONSTRAINT fk_pago_detalle_servicio FOREIGN KEY (id_servicio) REFERENCES public.cat_servicio(id_servicio);


--
-- Name: cobro fk_pago_metodo_pago; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro
    ADD CONSTRAINT fk_pago_metodo_pago FOREIGN KEY (id_metodo_pago) REFERENCES public.cat_metodo_pago(id_metodo_pago);


--
-- Name: cobro fk_pago_paciente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro
    ADD CONSTRAINT fk_pago_paciente FOREIGN KEY (id_paciente) REFERENCES public.paciente(id_paciente);


--
-- Name: cobro fk_pago_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cobro
    ADD CONSTRAINT fk_pago_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: permiso fk_permiso_menu; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT fk_permiso_menu FOREIGN KEY (id_menu) REFERENCES public.menu(id_menu);


--
-- Name: permiso fk_permiso_rol; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT fk_permiso_rol FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


--
-- Name: usuario fk_usuario_rol; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


--
-- Name: historial_clinico historial_clinico_id_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_id_cita_fkey FOREIGN KEY (id_cita) REFERENCES public.cita(id_cita);


--
-- Name: historial_clinico historial_clinico_id_doctor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_id_doctor_fkey FOREIGN KEY (id_doctor) REFERENCES public.doctor(id_doctor);


--
-- Name: historial_clinico historial_clinico_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.paciente(id_paciente);


--
-- Name: historial_clinico historial_clinico_id_usuario_creacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario);


--
-- Name: historial_clinico historial_clinico_id_usuario_modificacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_id_usuario_modificacion_fkey FOREIGN KEY (id_usuario_modificacion) REFERENCES public.usuario(id_usuario);


--
-- Name: receta receta_id_historial_clinico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_id_historial_clinico_fkey FOREIGN KEY (id_historial_clinico) REFERENCES public.historial_clinico(id_historial_clinico);


--
-- PostgreSQL database dump complete
--



-- ============================================================
-- DATOS BASE (roles, menus, permisos, catalogos, servicios)
-- ============================================================
--
-- PostgreSQL database dump
--


-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: cat_afeccion; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (1, 'Cardiovasculares', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (2, 'Renales', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (3, 'Hepatitis A, B o C', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (4, 'Tuberculosis', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (5, 'Problemas de Aprendizaje', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (6, 'Varicela', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (7, 'Alergias', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (8, 'Glándulas Endocrinas', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (9, 'Convulsiones y Ausencias', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (10, 'Infecciosas', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (11, 'Fiebre Reumática', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (12, 'Accidentes', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (13, 'Hemorrágicas', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (14, 'Paperas', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (15, 'Rubéola', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (16, 'Asma', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (17, 'HIV', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (18, 'Nerviosas', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (19, 'Meningitis', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (20, 'Anemia', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (21, 'Sarampión', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (22, 'Psicológicos', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (23, 'Diabetes', true);
INSERT INTO public.cat_afeccion (id_afeccion, nombre_afeccion, activo) VALUES (24, 'Encefalitis', true);


--
-- Data for Name: cat_especialidad; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cat_especialidad (id_especialidad, nombre, activo) VALUES (1, 'Ortodoncia', true);
INSERT INTO public.cat_especialidad (id_especialidad, nombre, activo) VALUES (2, 'Odontología General', true);
INSERT INTO public.cat_especialidad (id_especialidad, nombre, activo) VALUES (3, 'Endodoncia', true);
INSERT INTO public.cat_especialidad (id_especialidad, nombre, activo) VALUES (4, 'Odontopediatría', true);
INSERT INTO public.cat_especialidad (id_especialidad, nombre, activo) VALUES (5, 'Cirugía Oral', true);


--
-- Data for Name: cat_gasto; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cat_gasto (id_tipo_gasto, nombre_categoria, tipo, activo) VALUES (1, 'Teléfono', 'Fijo', true);
INSERT INTO public.cat_gasto (id_tipo_gasto, nombre_categoria, tipo, activo) VALUES (2, 'Agua', 'Fijo', true);
INSERT INTO public.cat_gasto (id_tipo_gasto, nombre_categoria, tipo, activo) VALUES (3, 'Luz', 'Fijo', true);
INSERT INTO public.cat_gasto (id_tipo_gasto, nombre_categoria, tipo, activo) VALUES (4, 'Alquiler', 'Fijo', true);
INSERT INTO public.cat_gasto (id_tipo_gasto, nombre_categoria, tipo, activo) VALUES (5, 'Sueldo Alexis', 'Fijo', true);
INSERT INTO public.cat_gasto (id_tipo_gasto, nombre_categoria, tipo, activo) VALUES (6, 'Materiales', 'Variable', true);
INSERT INTO public.cat_gasto (id_tipo_gasto, nombre_categoria, tipo, activo) VALUES (7, 'Insumos de limpieza', 'Variable', true);
INSERT INTO public.cat_gasto (id_tipo_gasto, nombre_categoria, tipo, activo) VALUES (8, 'Endo', 'Variable', true);
INSERT INTO public.cat_gasto (id_tipo_gasto, nombre_categoria, tipo, activo) VALUES (9, 'Cirugía', 'Variable', true);


--
-- Data for Name: cat_genero; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cat_genero (id_genero, nombre, activo) VALUES (1, 'Masculino', true);
INSERT INTO public.cat_genero (id_genero, nombre, activo) VALUES (2, 'Femenino', true);


--
-- Data for Name: cat_metodo_pago; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cat_metodo_pago (id_metodo_pago, nombre, comision_porcentaje) VALUES (2, 'Transferencia', 0.00);
INSERT INTO public.cat_metodo_pago (id_metodo_pago, nombre, comision_porcentaje) VALUES (3, 'Efectivo', 0.00);
INSERT INTO public.cat_metodo_pago (id_metodo_pago, nombre, comision_porcentaje) VALUES (1, 'Tarjeta', 8.00);
INSERT INTO public.cat_metodo_pago (id_metodo_pago, nombre, comision_porcentaje) VALUES (4, 'Mixto', 0.00);


--
-- Data for Name: cat_motivo_cita; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (1, 'Emergencia', true);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (2, 'Otro', true);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (3, 'Ortodoncia', true);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (4, 'Consulta general', true);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (5, 'Limpieza', true);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (6, 'Extracción', true);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (7, 'Dolor', true);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (8, 'Control', true);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (9, 'Revision de prueba', false);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (10, 'Verificacion201', false);
INSERT INTO public.cat_motivo_cita (id_motivo_cita, nombre, activo) VALUES (11, 'Garantia', true);


--
-- Data for Name: cat_parentesco; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (1, 'Padre', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (2, 'Madre', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (3, 'Hermano', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (4, 'Hermana', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (5, 'Hijo', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (6, 'Hija', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (7, 'Abuelo', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (8, 'Abuela', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (9, 'Tío', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (10, 'Tía', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (11, 'Esposo', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (12, 'Esposa', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (13, 'Primo', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (14, 'Prima', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (15, 'Tutor Legal', true);
INSERT INTO public.cat_parentesco (id_parentesco, nombre, activo) VALUES (16, 'Ninguno', true);


--
-- Data for Name: cat_profesion; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (1, 'Estudiante', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (2, 'Menor de Edad', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (3, 'Ama de Casa', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (4, 'Jubilado', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (5, 'Pensionado', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (6, 'Desempleado', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (7, 'No Especificado', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (8, 'Comerciante', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (9, 'Empresario', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (10, 'Ejecutivo de Ventas', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (11, 'Asesor Comercial', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (12, 'Supervisor de Ventas', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (13, 'Gerente de Sucursal', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (14, 'Vendedor', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (15, 'Propietario de Negocio', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (16, 'Perito Contador', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (17, 'Secretaria', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (18, 'Administrador de Empresas', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (19, 'Recepcionista', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (20, 'Cajero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (21, 'Asistente Administrativo', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (22, 'Auditor', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (23, 'Analista de Recursos Humanos', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (24, 'Asesor Financiero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (25, 'Asesor de Servicio al Cliente', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (26, 'Agente de Call Center', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (27, 'Auxiliar Contable', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (28, 'Abogado y Notario', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (29, 'Maestro', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (30, 'Profesor Universitario', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (31, 'Psicólogo', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (32, 'Trabajador Social', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (33, 'Pedagogo', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (34, 'Médico General', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (35, 'Enfermero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (36, 'Nutricionista', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (37, 'Farmacéutico', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (38, 'Fisioterapeuta', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (39, 'Veterinario', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (40, 'Asistente Dental', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (41, 'Ingeniero en Sistemas', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (42, 'Técnico en Informática', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (43, 'Desarrollador Web', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (44, 'Ingeniero Civil', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (45, 'Ingeniero Industrial', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (46, 'Ingeniero Mecánico', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (47, 'Arquitecto', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (48, 'Diseñador Gráfico', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (49, 'Publicista', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (50, 'Piloto Profesional', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (51, 'Mensajero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (52, 'Auxiliar de Bodega', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (53, 'Agente de Seguridad', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (54, 'Conserje', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (55, 'Supervisor de Operaciones', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (56, 'Gestor de Logística', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (57, 'Mecánico Automotriz', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (58, 'Electricista', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (59, 'Plomero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (60, 'Constructor', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (61, 'Carpintero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (62, 'Estilista', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (63, 'Barbero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (64, 'Sastre', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (65, 'Costurera', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (66, 'Técnico en Refrigeración', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (67, 'Soldador', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (68, 'Diseñador de Interiores', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (69, 'Chef', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (70, 'Cocinero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (71, 'Mesero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (72, 'Panadero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (73, 'Pastelero', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (74, 'Barista', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (75, 'Administrador de Hotel', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (76, 'Perito Agrónomo', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (77, 'Consultor Independiente', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (78, 'Empleado Público', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (79, 'Fotógrafo', true);
INSERT INTO public.cat_profesion (id_profesion, nombre, activo) VALUES (80, 'Técnico Profesional', true);


--
-- Data for Name: departamento; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (1, 'Alta Verapaz', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (2, 'Baja Verapaz', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (3, 'Chimaltenango', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (4, 'Chiquimula', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (5, 'El Progreso', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (6, 'Escuintla', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (7, 'Guatemala', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (8, 'Huehuetenango', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (9, 'Izabal', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (10, 'Jalapa', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (11, 'Jutiapa', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (12, 'Petén', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (13, 'Quetzaltenango', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (14, 'Quiché', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (15, 'Retalhuleu', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (16, 'Sacatepéquez', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (17, 'San Marcos', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (18, 'Santa Rosa', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (19, 'Sololá', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (20, 'Suchitepéquez', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (21, 'Totonicapán', true);
INSERT INTO public.departamento (id_departamento, nombre, activo) VALUES (22, 'Zacapa', true);


--
-- Data for Name: estado_cita; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.estado_cita (id_estado_cita, nombre) VALUES (1, 'Confirmada');
INSERT INTO public.estado_cita (id_estado_cita, nombre) VALUES (2, 'Cancelada');
INSERT INTO public.estado_cita (id_estado_cita, nombre) VALUES (3, 'Pendiente');
INSERT INTO public.estado_cita (id_estado_cita, nombre) VALUES (5, 'No asistió');
INSERT INTO public.estado_cita (id_estado_cita, nombre) VALUES (6, 'Atendida');


--
-- Data for Name: estado_cobro; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.estado_cobro (id_estado_cobro, nombre) VALUES (1, 'Pagado');
INSERT INTO public.estado_cobro (id_estado_cobro, nombre) VALUES (2, 'Anulado');


--
-- Data for Name: modulo; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.modulo (id_modulo, nombre, descripcion) VALUES (1, 'Inventario', 'Control de insumos');
INSERT INTO public.modulo (id_modulo, nombre, descripcion) VALUES (2, 'Auditoría', 'Bitácora del sistema');
INSERT INTO public.modulo (id_modulo, nombre, descripcion) VALUES (3, 'Agenda', 'Agenda de citas');
INSERT INTO public.modulo (id_modulo, nombre, descripcion) VALUES (4, 'Clínico', 'Historial clínico, consultas y tratamientos');
INSERT INTO public.modulo (id_modulo, nombre, descripcion) VALUES (5, 'Catálogos', 'Catálogos generales del sistema');
INSERT INTO public.modulo (id_modulo, nombre, descripcion) VALUES (6, 'Finanzas', 'Pagos, gastos y comisiones');
INSERT INTO public.modulo (id_modulo, nombre, descripcion) VALUES (7, 'Administración', 'Gestión de usuarios y permisos del sistema');
INSERT INTO public.modulo (id_modulo, nombre, descripcion) VALUES (8, 'Dashboard', 'Panel principal del sistema');


--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (4, 'Bitácora', '/bitacora', 1, true, 2);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (5, 'Citas', '/citas', 1, true, 3);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (9, 'Doctores', '/doctores', 2, true, 4);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (11, 'Pacientes', '/pacientes', 1, true, 4);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (37, 'Usuarios', '/usuarios', 1, true, 7);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (38, 'Permisos', '/permisos', 2, true, 7);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (41, 'Menús', '/menus', 3, true, 7);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (1, 'Inventario', '/instrumental', 1, true, 1);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (45, 'Inicio', '/dashboard', 1, true, 8);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (39, 'Dashboard Financiero', '/financiero/dashboard', 1, true, 6);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (42, 'Cobros', '/cobros', 2, true, 6);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (30, 'Gastos', '/gastos', 3, true, 6);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (20, 'Especialidades', '/catalogos/especialidades', 1, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (26, 'Profesiones', '/catalogos/profesiones', 2, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (21, 'Géneros', '/catalogos/generos', 3, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (22, 'Parentescos', '/catalogos/parentescos', 4, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (23, 'Métodos de Pago', '/catalogos/metodos-pago', 5, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (19, 'Tipos de Gasto', '/catalogos/tipos-gasto', 6, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (18, 'Departamentos', '/departamentos', 7, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (28, 'Municipios', '/municipios', 8, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (17, 'Afecciones', '/catalogos/afecciones', 9, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (24, 'Servicios', '/servicios', 10, true, 5);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (40, 'Pago de Comisiones', '/financiero/pago-comisiones', 5, true, 6);
INSERT INTO public.menu (id_menu, nombre, ruta, orden, activo, id_modulo) VALUES (46, 'Motivos de Cita', '/catalogos/motivos-cita', 11, true, 5);


--
-- Data for Name: municipio; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (1, 'Cobán', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (2, 'San Pedro Carchá', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (3, 'Chisec', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (4, 'Fray Bartolomé de las Casas', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (5, 'Tactic', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (6, 'Senahú', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (7, 'San Cristóbal Verapaz', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (8, 'Panzós', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (9, 'Cahabón', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (10, 'Lanquín', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (11, 'Chahal', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (12, 'San Juan Chamelco', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (13, 'Raxruhá', 1, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (14, 'Salamá', 2, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (15, 'Rabinal', 2, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (16, 'Cubulco', 2, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (17, 'San Miguel Chicaj', 2, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (18, 'Purulhá', 2, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (19, 'Granados', 2, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (20, 'San Jerónimo', 2, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (21, 'El Chol', 2, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (22, 'Chimaltenango', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (23, 'Tecpán Guatemala', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (24, 'Patzún', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (25, 'San Martín Jilotepeque', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (26, 'Patzicía', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (27, 'El Tejar', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (28, 'Zaragoza', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (29, 'San Andrés Itzapa', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (30, 'Comalapa', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (31, 'Acatenango', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (32, 'Parramos', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (33, 'San José Poaquil', 3, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (34, 'Chiquimula', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (35, 'Esquipulas', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (36, 'Jocotán', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (37, 'Camotán', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (38, 'Ipala', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (39, 'Quezaltepeque', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (40, 'San Jacinto', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (41, 'San Juan Ermita', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (42, 'Olopa', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (43, 'Concepción Las Minas', 4, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (44, 'Guastatoya', 5, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (45, 'Sanarate', 5, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (46, 'San Agustín Acasaguastlán', 5, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (47, 'El Jícaro', 5, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (48, 'Sansare', 5, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (49, 'San Cristóbal Acasaguastlán', 5, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (50, 'Morazán', 5, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (51, 'El Jícaro', 5, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (52, 'Escuintla', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (53, 'Santa Lucía Cotzumalguapa', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (54, 'Puerto San José', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (55, 'Tiquisate', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (56, 'Palín', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (57, 'Siquinalá', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (58, 'La Democracia', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (59, 'Masagua', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (60, 'San Vicente Pacaya', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (61, 'La Gomera', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (62, 'Guanagazapa', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (63, 'Iztapa', 6, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (64, 'Guatemala', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (65, 'Mixco', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (66, 'Villa Nueva', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (67, 'San Juan Sacatepéquez', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (68, 'Villa Canales', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (69, 'Amatitlán', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (70, 'Santa Catarina Pinula', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (71, 'San Miguel Petapa', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (72, 'Chinautla', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (73, 'San José Pinula', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (74, 'San Pedro Sacatepéquez', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (75, 'Fraijanes', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (76, 'Palencia', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (77, 'San Raymundo', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (78, 'Chuarrancho', 7, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (79, 'Huehuetenango', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (80, 'Chiantla', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (81, 'Barillas', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (82, 'Jacaltenango', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (83, 'Soloma', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (84, 'San Pedro Necta', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (85, 'Todos Santos Cuchumatán', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (86, 'San Juan Ixcoy', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (87, 'San Mateo Ixtatán', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (88, 'Colotenango', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (89, 'Malacatancito', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (90, 'Cuilco', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (91, 'Santa Bárbara', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (92, 'La Libertad', 8, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (93, 'Puerto Barrios', 9, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (94, 'Morales', 9, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (95, 'Los Amates', 9, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (96, 'El Estor', 9, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (97, 'Livingston', 9, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (98, 'Jalapa', 10, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (99, 'Mataquescuintla', 10, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (100, 'San Pedro Pinula', 10, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (101, 'Monjas', 10, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (102, 'San Luis Jilotepeque', 10, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (103, 'San Manuel Chaparrón', 10, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (104, 'San Carlos Alzatate', 10, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (105, 'Jutiapa', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (106, 'Asunción Mita', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (107, 'Moyuta', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (108, 'Comapa', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (109, 'Jalpatagua', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (110, 'El Progreso', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (111, 'Agua Blanca', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (112, 'Atescatempa', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (113, 'Quesada', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (114, 'Zapotitlán', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (115, 'Pasaco', 11, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (116, 'Flores', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (117, 'San Benito', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (118, 'Poptún', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (119, 'Sayaxché', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (120, 'La Libertad', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (121, 'Melchor de Mencos', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (122, 'San Andrés', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (123, 'San Francisco', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (124, 'San José', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (125, 'Santa Ana', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (126, 'Dolores', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (127, 'Las Cruces', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (128, 'El Chal', 12, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (129, 'Quetzaltenango', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (130, 'Coatepeque', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (131, 'Ostuncalco', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (132, 'Salcajá', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (133, 'Cantel', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (134, 'Colomba Costa Cuca', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (135, 'Almolonga', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (136, 'Zunil', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (137, 'San Carlos Sija', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (138, 'Olintepeque', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (139, 'San Juan Ostuncalco', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (140, 'Génova', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (141, 'El Palmar', 13, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (142, 'Santa Cruz del Quiché', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (143, 'Chichicastenango', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (144, 'Nebaj', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (145, 'Joyabaj', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (146, 'Sacapulas', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (147, 'Ixcán', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (148, 'Cunén', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (149, 'Chajul', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (150, 'Cotzal', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (151, 'Uspantán', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (152, 'Zacualpa', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (153, 'San Pedro Jocopilas', 14, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (154, 'Retalhuleu', 15, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (155, 'San Andrés Villa Seca', 15, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (156, 'Nuevo San Carlos', 15, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (157, 'Champerico', 15, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (158, 'El Asintal', 15, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (159, 'San Martín Zapotitlán', 15, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (160, 'San Felipe', 15, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (161, 'Santa Cruz Muluá', 15, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (162, 'Antigua Guatemala', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (163, 'Ciudad Vieja', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (164, 'Santiago Sacatepéquez', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (165, 'Sumpango', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (166, 'San Lucas Sacatepéquez', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (167, 'Jocotenango', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (168, 'Pastores', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (169, 'Alotenango', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (170, 'San Miguel Dueñas', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (171, 'Santa María de Jesús', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (172, 'Santo Domingo Xenacoj', 16, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (173, 'San Marcos', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (174, 'San Pedro Sacatepéquez', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (175, 'Malacatán', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (176, 'Ayutla (Tecún Umán)', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (177, 'Catarina', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (178, 'Tacaná', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (179, 'Comitancillo', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (180, 'Concepción Tutuapa', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (181, 'Tajumulco', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (182, 'Tejutla', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (183, 'El Tumbador', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (184, 'San Pablo', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (185, 'Pajapita', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (186, 'Ixchiguán', 17, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (187, 'Cuilapa', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (188, 'Barberena', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (189, 'Chiquimulilla', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (190, 'Taxisco', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (191, 'Nueva Santa Rosa', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (192, 'Guazacapán', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (193, 'Santa María Ixhuatán', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (194, 'San Rafael Las Flores', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (195, 'Casillas', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (196, 'Chiquimulilla', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (197, 'Santa Cruz Naranjo', 18, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (198, 'Sololá', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (199, 'Panajachel', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (200, 'Santiago Atitlán', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (201, 'Nahualá', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (202, 'San Lucas Tolimán', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (203, 'Santa Lucía Utatlán', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (204, 'San Pedro La Laguna', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (205, 'San Juan La Laguna', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (206, 'Santa Catarina Palopó', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (207, 'San Antonio Palopó', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (208, 'Santa Clara La Laguna', 19, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (209, 'Mazatenango', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (210, 'Cuyotenango', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (211, 'Chicacao', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (212, 'Patulul', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (213, 'San Antonio Suchitepéquez', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (214, 'Samayac', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (215, 'San Pablo Jocopilas', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (216, 'San Bernardino', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (217, 'San Francisco Zapotitlán', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (218, 'Santo Tomás La Unión', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (219, 'Zunilito', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (220, 'Santa Bárbara', 20, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (221, 'Totonicapán', 21, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (222, 'Momostenango', 21, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (223, 'San Francisco El Alto', 21, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (224, 'San Cristóbal Totonicapán', 21, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (225, 'San Andrés Xecul', 21, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (226, 'Santa María Chiquimula', 21, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (227, 'San Bartolo', 21, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (228, 'Santa Lucía La Reforma', 21, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (229, 'Zacapa', 22, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (230, 'Gualán', 22, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (231, 'Teculután', 22, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (232, 'Estanzuela', 22, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (233, 'Río Hondo', 22, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (234, 'San Diego', 22, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (235, 'La Unión', 22, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (236, 'Usumatlán', 22, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (237, 'Cabañas', 22, true);
INSERT INTO public.municipio (id_municipio, nombre, id_departamento, activo) VALUES (238, 'Huité', 22, true);


--
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.rol (id_rol, nombre, descripcion) VALUES (1, 'ADMIN', 'Administrador del sistema con acceso total');
INSERT INTO public.rol (id_rol, nombre, descripcion) VALUES (3, 'DOCTOR', 'Acceso a historias clínicas y consultas');
INSERT INTO public.rol (id_rol, nombre, descripcion) VALUES (2, 'RECEPCION', 'Recepcionista o Asistente');


--
-- Data for Name: permiso; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (4, 1, 30, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (5, 1, 28, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (8, 1, 9, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (11, 1, 4, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (12, 1, 23, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (13, 1, 1, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (14, 1, 22, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (15, 1, 11, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (17, 1, 17, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (32, 1, 5, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (19, 1, 18, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (23, 1, 20, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (24, 1, 26, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (103, 1, 45, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (27, 1, 19, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (104, 3, 45, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (29, 1, 24, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (33, 1, 21, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (105, 2, 45, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (39, 3, 5, true, true, true, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (79, 2, 9, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (76, 2, 5, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (74, 2, 11, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (52, 3, 9, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (71, 2, 1, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (61, 3, 24, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (106, 2, 17, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (94, 1, 37, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (95, 1, 38, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (96, 1, 39, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (97, 1, 40, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (100, 1, 41, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (82, 2, 18, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (107, 2, 20, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (86, 2, 19, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (87, 2, 21, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (80, 2, 22, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (81, 2, 23, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (85, 2, 24, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (59, 3, 20, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (60, 3, 11, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (62, 3, 17, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (84, 2, 26, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (68, 2, 30, true, true, true, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (78, 2, 28, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (98, 2, 39, true, true, true, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (99, 2, 40, true, true, true, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (101, 1, 42, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (102, 2, 42, true, true, true, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (108, 3, 18, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (109, 3, 21, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (110, 3, 22, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (111, 3, 23, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (112, 3, 26, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (113, 3, 28, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (114, 1, 46, true, true, true, true);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (115, 3, 46, true, false, false, false);
INSERT INTO public.permiso (id_permiso, id_rol, id_menu, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES (116, 2, 46, true, false, false, false);


--
-- Data for Name: tipo_movimiento; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tipo_movimiento (id_tipo_movimiento, nombre_movimiento, operacion) VALUES (1, 'Compra de insumos', true);
INSERT INTO public.tipo_movimiento (id_tipo_movimiento, nombre_movimiento, operacion) VALUES (2, 'Uso en consulta', false);
INSERT INTO public.tipo_movimiento (id_tipo_movimiento, nombre_movimiento, operacion) VALUES (3, 'Ajuste de inventario', true);
INSERT INTO public.tipo_movimiento (id_tipo_movimiento, nombre_movimiento, operacion) VALUES (4, 'Baja por daño', false);
INSERT INTO public.tipo_movimiento (id_tipo_movimiento, nombre_movimiento, operacion) VALUES (5, 'Devolución', true);


--
-- Name: cat_afeccion_id_afeccion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_afeccion_id_afeccion_seq', 2, true);


--
-- Name: cat_especialidad_id_especialidad_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_especialidad_id_especialidad_seq', 2, true);


--
-- Name: cat_estado_cita_id_estado_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_estado_cita_id_estado_cita_seq', 6, true);


--
-- Name: cat_gasto_id_tipo_gasto_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_gasto_id_tipo_gasto_seq', 9, true);


--
-- Name: cat_genero_id_genero_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_genero_id_genero_seq', 2, true);


--
-- Name: cat_metodo_pago_id_metodo_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_metodo_pago_id_metodo_pago_seq', 3, true);


--
-- Name: cat_motivo_cita_id_motivo_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_motivo_cita_id_motivo_cita_seq', 11, true);


--
-- Name: cat_movimiento_id_tipo_movimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_movimiento_id_tipo_movimiento_seq', 5, true);


--
-- Name: cat_parentesco_id_parentesco_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_parentesco_id_parentesco_seq', 1, false);


--
-- Name: cat_profesion_id_profesion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_profesion_id_profesion_seq', 1, false);


--
-- Name: departamento_id_departamento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.departamento_id_departamento_seq', 22, true);


--
-- Name: estado_cobro_id_estado_cobro_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.estado_cobro_id_estado_cobro_seq', 2, true);


--
-- Name: menu_id_menu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.menu_id_menu_seq', 46, true);


--
-- Name: modulo_id_modulo_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.modulo_id_modulo_seq', 8, true);


--
-- Name: municipio_id_municipio_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.municipio_id_municipio_seq', 1, false);


--
-- Name: permiso_id_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permiso_id_permiso_seq', 116, true);


--
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rol_id_rol_seq', 3, true);


--
-- PostgreSQL database dump complete
--



-- ============================================================
-- USUARIO ADMIN DE PRUEBA (usuario: admin / contrasena: Prueba2026)
-- ============================================================
INSERT INTO public.usuario (nombre, apellido, username, password_hash, estado, id_rol)
VALUES ('Admin', 'Prueba', 'admin', '$2b$10$maQV6Qyp6c7NSLGxQoLlRewqpZv.jIHK9GLKOgRurkclAj3rHBbZe', true, 1);
