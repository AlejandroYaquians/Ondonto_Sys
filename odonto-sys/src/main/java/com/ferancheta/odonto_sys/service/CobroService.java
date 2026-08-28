package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CobroRequest;
import com.ferancheta.odonto_sys.dto.response.CobroResponse;
import com.ferancheta.odonto_sys.entity.CatMetodoPago;
import com.ferancheta.odonto_sys.entity.Cita;
import com.ferancheta.odonto_sys.entity.Cobro;
import com.ferancheta.odonto_sys.entity.CobroDetalle;
import com.ferancheta.odonto_sys.entity.Comision;
import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.entity.Paciente;
import com.ferancheta.odonto_sys.entity.Servicio;
import com.ferancheta.odonto_sys.mapper.CobroMapper;
import com.ferancheta.odonto_sys.mapper.ComisionMapper;
import com.ferancheta.odonto_sys.repository.CatMetodoPagoRepository;
import com.ferancheta.odonto_sys.repository.CitaRepository;
import com.ferancheta.odonto_sys.repository.CobroDetalleRepository;
import com.ferancheta.odonto_sys.repository.CobroRepository;
import com.ferancheta.odonto_sys.repository.ComisionRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import com.ferancheta.odonto_sys.repository.ServicioRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CobroService {

    private static final int ESCALA = 2;
    private static final String NOMBRE_EFECTIVO = "Efectivo";
    private static final String NOMBRE_TARJETA = "Tarjeta";
    private static final DateTimeFormatter FORMATO_CODIGO = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final LocalDateTime FECHA_MINIMA = LocalDateTime.of(2000, 1, 1, 0, 0);
    private static final LocalDateTime FECHA_MAXIMA = LocalDateTime.of(2100, 1, 1, 0, 0);

    private final CobroRepository repository;
    private final CobroDetalleRepository detalleRepository;
    private final ComisionRepository comisionRepository;
    private final PacienteRepository pacienteRepository;
    private final DoctorRepository doctorRepository;
    private final CitaRepository citaRepository;
    private final ServicioRepository servicioRepository;
    private final CatMetodoPagoRepository catMetodoPagoRepository;
    private final ContextoAutenticacion contexto;
    private final BitacoraService bitacoraService;
    private final CobroMapper mapper;
    private final ComisionMapper comisionMapper;

    @Transactional(readOnly = true)
    public List<CobroResponse> listar(LocalDate desde, LocalDate hasta, Integer idDoctor, Integer idMetodoPago) {
        LocalDateTime desdeFecha = desde != null ? desde.atStartOfDay() : FECHA_MINIMA;
        LocalDateTime hastaFecha = hasta != null ? hasta.atTime(23, 59, 59) : FECHA_MAXIMA;
        return repository.findByFechaBetweenOrderByFechaDesc(desdeFecha, hastaFecha).stream()
                .filter(c -> idMetodoPago == null || idMetodoPago.equals(c.getMetodoPago().getIdMetodoPago()))
                .filter(c -> idDoctor == null || tieneComisionDeDoctor(c, idDoctor))
                .map(mapper::toResponse)
                .toList();
    }

    private boolean tieneComisionDeDoctor(Cobro cobro, Integer idDoctor) {
        return cobro.getComisiones() != null && cobro.getComisiones().stream()
                .anyMatch(comision -> idDoctor.equals(comision.getDoctor().getIdDoctor()));
    }

    @Transactional(readOnly = true)
    public List<CobroResponse> listarPorPaciente(Integer idPaciente) {
        return repository.findByPaciente_IdPaciente(idPaciente).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CobroResponse> listarPorCita(Integer idCita) {
        return repository.findByCita_IdCita(idCita).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CobroResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public CobroResponse crear(CobroRequest request) {
        Paciente paciente = pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente()));
        Doctor doctor = doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor()));
        Servicio servicio = servicioRepository.findById(request.idServicio())
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado: " + request.idServicio()));
        Cita cita = null;
        if (request.idCita() != null) {
            cita = citaRepository.findById(request.idCita())
                    .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada: " + request.idCita()));
        }

        return registrarCobro(paciente, cita, doctor, servicio, request.precioAplicado(),
                request.costoLaboratorio(), request.montoEfectivo(), request.montoTarjeta(),
                request.idMetodoPago(), null);
    }

    @Transactional
    CobroResponse registrarCobro(Paciente paciente, Cita cita, Doctor doctor, Servicio servicio, BigDecimal precioAplicado,
                          BigDecimal costoLaboratorioRequest, BigDecimal montoEfectivoRequest,
                          BigDecimal montoTarjetaRequest, Integer idMetodoPagoSolicitado,
                          com.ferancheta.odonto_sys.entity.HistorialClinico historialClinico) {

        BigDecimal montoEfectivo = montoEfectivoRequest != null ? montoEfectivoRequest : BigDecimal.ZERO;
        BigDecimal montoTarjeta = montoTarjetaRequest != null ? montoTarjetaRequest : BigDecimal.ZERO;
        BigDecimal costoLaboratorio = costoLaboratorioRequest != null ? costoLaboratorioRequest : BigDecimal.ZERO;

        CatMetodoPago metodoPago = obtenerMetodoPago(idMetodoPagoSolicitado, montoTarjeta);
        BigDecimal comisionPorcentajeBanco = metodoPago.getComisionPorcentaje() != null
                ? metodoPago.getComisionPorcentaje() : BigDecimal.ZERO;

        BigDecimal montoBruto = montoEfectivo.add(montoTarjeta);
        BigDecimal comisionTarjeta = montoTarjeta
                .multiply(comisionPorcentajeBanco)
                .divide(BigDecimal.valueOf(100), ESCALA, RoundingMode.HALF_UP);
        BigDecimal montoNeto = montoBruto.subtract(comisionTarjeta).subtract(costoLaboratorio);

        BigDecimal porcentajeComisionDoctor = doctor.getPorcentajeComision() != null
                ? doctor.getPorcentajeComision() : BigDecimal.ZERO;
        BigDecimal comisionDoctor = montoNeto
                .multiply(porcentajeComisionDoctor)
                .divide(BigDecimal.valueOf(100), ESCALA, RoundingMode.HALF_UP);

        Cobro cobro = new Cobro();
        cobro.setMontoEfectivo(montoEfectivo);
        cobro.setMontoTarjeta(montoTarjeta);
        cobro.setComisionTarjeta(comisionTarjeta);
        cobro.setCostoLaboratorio(costoLaboratorio);
        cobro.setMontoBruto(montoBruto);
        cobro.setMontoNeto(montoNeto);
        cobro.setCodigoCobro(generarCodigoCobro());
        cobro.setEstado("pagado");
        cobro.setPaciente(paciente);
        cobro.setCita(cita);
        cobro.setMetodoPago(metodoPago);
        cobro.setUsuario(contexto.usuarioActual());
        cobro.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        Cobro cobroGuardado = repository.save(cobro);

        CobroDetalle detalle = new CobroDetalle();
        detalle.setCobro(cobroGuardado);
        detalle.setServicio(servicio);
        detalle.setMetodoPago(metodoPago);
        detalle.setHistorialClinico(historialClinico);
        detalle.setPrecioAplicado(precioAplicado);
        detalle.setCostoLaboratorio(costoLaboratorio);
        detalle.setComisionDoctorCalculada(comisionDoctor);
        detalleRepository.save(detalle);

        Comision comision = new Comision();
        comision.setDoctor(doctor);
        comision.setCobro(cobroGuardado);
        comision.setMontoBase(montoNeto);
        comision.setPorcentajeAplicado(porcentajeComisionDoctor);
        comision.setMontoComision(comisionDoctor);
        comision.setEstado("pendiente");
        comision.setFecha(LocalDate.now());
        comision.setUsuarioCreacion(contexto.usuarioActual());
        Comision comisionGuardada = comisionRepository.save(comision);

        cobroGuardado.setDetalles(List.of(detalle));
        cobroGuardado.setComisiones(List.of(comisionGuardada));
        CobroResponse respuesta = mapper.toResponse(cobroGuardado);

        bitacoraService.registrarCambio("cobro", cobroGuardado.getIdCobro(), "INSERT", null, respuesta);
        bitacoraService.registrarCambio("comision", comisionGuardada.getIdComision(), "INSERT",
                null, comisionMapper.toResponse(comisionGuardada));

        return respuesta;
    }

    private CatMetodoPago obtenerMetodoPago(Integer idMetodoPagoSolicitado, BigDecimal montoTarjeta) {
        if (idMetodoPagoSolicitado != null) {
            return catMetodoPagoRepository.findById(idMetodoPagoSolicitado)
                    .orElseThrow(() -> new EntityNotFoundException("Método de pago no encontrado: " + idMetodoPagoSolicitado));
        }
        String nombre = montoTarjeta.compareTo(BigDecimal.ZERO) > 0 ? NOMBRE_TARJETA : NOMBRE_EFECTIVO;
        return catMetodoPagoRepository.findByNombreIgnoreCase(nombre)
                .orElseThrow(() -> new EntityNotFoundException("Método de pago no encontrado: " + nombre));
    }

    private Long generarCodigoCobro() {
        return Long.parseLong(LocalDateTime.now().format(FORMATO_CODIGO));
    }

    @Transactional
    public CobroResponse cambiarEstado(Integer id, String estado) {
        Cobro cobro = obtenerEntidad(id);
        cobro.setEstado(estado);
        return mapper.toResponse(repository.save(cobro));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private Cobro obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cobro no encontrado: " + id));
    }
}
