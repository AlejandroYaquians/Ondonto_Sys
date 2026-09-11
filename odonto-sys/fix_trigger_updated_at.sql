CREATE FUNCTION public.fn_fecha_modificacion()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

DROP TRIGGER trg_cita_updated_at ON public.cita;
CREATE TRIGGER trg_cita_fecha_modificacion
    BEFORE UPDATE ON public.cita
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_fecha_modificacion();

DROP TRIGGER trg_doctor_updated_at ON public.doctor;
CREATE TRIGGER trg_doctor_fecha_modificacion
    BEFORE UPDATE ON public.doctor
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_fecha_modificacion();

DROP TRIGGER trg_gasto_updated_at ON public.gasto;
CREATE TRIGGER trg_gasto_fecha_modificacion
    BEFORE UPDATE ON public.gasto
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_fecha_modificacion();

DROP TRIGGER trg_insumo_updated_at ON public.instrumental;
CREATE TRIGGER trg_insumo_fecha_modificacion
    BEFORE UPDATE ON public.instrumental
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_fecha_modificacion();

DROP TRIGGER trg_paciente_updated_at ON public.paciente;
CREATE TRIGGER trg_paciente_fecha_modificacion
    BEFORE UPDATE ON public.paciente
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_fecha_modificacion();

DROP TRIGGER trg_pago_updated_at ON public.cobro;
CREATE TRIGGER trg_pago_fecha_modificacion
    BEFORE UPDATE ON public.cobro
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_fecha_modificacion();

DROP TRIGGER trg_usuario_updated_at ON public.usuario;
CREATE TRIGGER trg_usuario_fecha_modificacion
    BEFORE UPDATE ON public.usuario
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_fecha_modificacion();

DROP FUNCTION public.fn_updated_at();
