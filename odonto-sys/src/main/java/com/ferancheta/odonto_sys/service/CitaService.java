package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.CitaRequest;
import com.ferancheta.odonto_sys.dto.response.CitaResponse;
import com.ferancheta.odonto_sys.entity.CatEstadoCita;
import com.ferancheta.odonto_sys.entity.Cita;
import com.ferancheta.odonto_sys.entity.Cobro;
import com.ferancheta.odonto_sys.entity.Comision;
import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.mapper.CitaMapper;
import com.ferancheta.odonto_sys.repository.CatEstadoCitaRepository;
import com.ferancheta.odonto_sys.repository.CatMotivoCitaRepository;
import com.ferancheta.odonto_sys.repository.CitaRepository;
import com.ferancheta.odonto_sys.repository.CobroRepository;
import com.ferancheta.odonto_sys.repository.ComisionRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CitaService {

    private static final long PROXIMIDAD_MINUTOS = 30;
    private static final String ESTADO_CONFIRMADA = "Confirmada";
    private static final String ESTADO_PENDIENTE = "Pendiente";
    private static final String ESTADO_CANCELADA = "Cancelada";
    private static final String ESTADO_NO_ASISTIO = "No asistió";
    private static final String ESTADO_ATENDIDA = "Atendida";
    private static final DateTimeFormatter FORMATO_HORA = DateTimeFormatter.ofPattern("HH:mm");

    private static final Set<String> TRANSICIONES_DESDE_CONFIRMADA = Set.of(ESTADO_CANCELADA, ESTADO_NO_ASISTIO);
    private static final Set<String> TRANSICIONES_DESDE_PENDIENTE =
            Set.of(ESTADO_CONFIRMADA, ESTADO_CANCELADA, ESTADO_NO_ASISTIO);

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final DoctorRepository doctorRepository;
    private final CatEstadoCitaRepository catEstadoCitaRepository;
    private final CatMotivoCitaRepository catMotivoCitaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CobroRepository cobroRepository;
    private final ComisionRepository comisionRepository;
    private final ContextoAutenticacion contexto;
    private final CitaMapper mapper;

    @Transactional(readOnly = true)
    public List<CitaResponse> listar() {
        if (contexto.esDoctor()) {
            return citaRepository.findByDoctor_IdDoctor(contexto.doctorActual().getIdDoctor())
                    .stream().filter(this::noEsCancelada).map(mapper::toResponse).toList();
        }
        return citaRepository.findAll().stream().filter(this::noEsCancelada).map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listarPorDoctorYFecha(Integer idDoctor, LocalDate fecha) {
        validarAccesoADoctor(idDoctor);
        return citaRepository.findByDoctor_IdDoctorAndFecha(idDoctor, fecha)
                .stream().filter(this::noEsCancelada).map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listarPorPaciente(Integer idPaciente) {
        List<Cita> citas = citaRepository.findByPaciente_IdPaciente(idPaciente);
        if (contexto.esDoctor()) {
            Integer idDoctorActual = contexto.doctorActual().getIdDoctor();
            citas = citas.stream().filter(c -> c.getDoctor().getIdDoctor().equals(idDoctorActual)).toList();
        }
        return citas.stream().map(mapper::toResponse).toList();
    }

    private boolean noEsCancelada(Cita cita) {
        return !ESTADO_CANCELADA.equals(cita.getEstadoCita().getNombre());
    }

    @Transactional(readOnly = true)
    public CitaResponse buscarPorId(Integer id) {
        Cita cita = obtenerEntidad(id);
        validarPropietario(cita);
        return mapper.toResponse(cita);
    }

    @Transactional
    public CitaResponse crear(CitaRequest request) {
        validarNoEsDoctor("crear");
        validarAccesoADoctor(request.idDoctor());
        validarFechaNoPasada(request.fecha());
        validarProximidad(request, null);
        Cita cita = mapper.toEntity(request);
        cita.setEstadoCita(buscarEstadoPorNombre(ESTADO_CONFIRMADA));
        cita.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(cita, request);
        return mapper.toResponse(citaRepository.save(cita));
    }

    @Transactional
    public CitaResponse actualizar(Integer id, CitaRequest request) {
        validarNoEsDoctor("editar");
        Cita existente = obtenerEntidad(id);
        validarPropietario(existente);
        validarAccesoADoctor(request.idDoctor());
        if (ESTADO_ATENDIDA.equals(existente.getEstadoCita().getNombre())) {
            throw new IllegalStateException("No se puede editar una cita que ya fue atendida");
        }
        validarFechaNoPasada(request.fecha());
        validarProximidad(request, id);
        Cita actualizada = mapper.toEntity(request);
        actualizada.setIdCita(existente.getIdCita());
        actualizada.setEstadoCita(existente.getEstadoCita());
        actualizada.setIdUsuarioCreacion(existente.getIdUsuarioCreacion());
        actualizada.setIdUsuarioModificacion(contexto.usuarioActual().getIdUsuario());
        aplicarRelaciones(actualizada, request);
        return mapper.toResponse(citaRepository.save(actualizada));
    }

    @Transactional
    public CitaResponse cambiarEstado(Integer id, String nuevoEstado) {
        validarNoEsDoctor("cambiar el estado de");
        Cita cita = obtenerEntidad(id);
        validarPropietario(cita);

        String estadoActual = cita.getEstadoCita().getNombre();
        Set<String> transicionesPermitidas =
                switch (estadoActual) {
                    case ESTADO_CONFIRMADA -> TRANSICIONES_DESDE_CONFIRMADA;
                    case ESTADO_PENDIENTE -> TRANSICIONES_DESDE_PENDIENTE;
                    default -> Set.of();
                };

        if (!transicionesPermitidas.contains(nuevoEstado)) {
            throw new IllegalStateException(
                    "No se puede cambiar el estado de \"" + estadoActual + "\" a \"" + nuevoEstado + "\"");
        }

        cita.setEstadoCita(buscarEstadoPorNombre(nuevoEstado));
        return mapper.toResponse(citaRepository.save(cita));
    }

    @Transactional
    public CitaResponse cambiarDoctor(Integer id, Integer idDoctor) {
        validarNoEsDoctor("cambiar el doctor de");
        Cita cita = obtenerEntidad(id);
        Doctor doctor = doctorRepository.findById(idDoctor)
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + idDoctor));

        cita.setDoctor(doctor);
        Cita citaActualizada = citaRepository.save(cita);

        for (Cobro cobro : cobroRepository.findByCita_IdCita(id)) {
            for (Comision comision : comisionRepository.findByCobro_IdCobro(cobro.getIdCobro())) {
                comision.setDoctor(doctor);
                comisionRepository.save(comision);
            }
        }

        return mapper.toResponse(citaActualizada);
    }

    @Transactional
    public void eliminar(Integer id) {
        Cita cita = obtenerEntidad(id);
        validarPropietario(cita);
        citaRepository.delete(cita);
    }

    private void validarFechaNoPasada(LocalDate fecha) {
        if (fecha.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("No se puede agendar una cita en una fecha que ya pasó.");
        }
    }

    private void validarProximidad(CitaRequest request, Integer idCitaExcluir) {
        if (request.forzarGuardado()) {
            return;
        }

        List<Cita> citasDelDia = citaRepository.findByDoctor_IdDoctorAndFecha(request.idDoctor(), request.fecha());

        Cita citaCercana = citasDelDia.stream()
                .filter(c -> idCitaExcluir == null || !c.getIdCita().equals(idCitaExcluir))
                .filter(this::noEsCancelada)
                .filter(c -> Math.abs(Duration.between(c.getHora(), request.hora()).toMinutes()) < PROXIMIDAD_MINUTOS)
                .findFirst()
                .orElse(null);

        if (citaCercana == null) {
            return;
        }

        String horaConflicto = citaCercana.getHora().format(FORMATO_HORA);
        throw new IllegalStateException("El doctor tiene una cita a las " + horaConflicto + ".");
    }

    private void validarNoEsDoctor(String accion) {
        if (contexto.esDoctor()) {
            throw new AccessDeniedException("Los doctores no pueden " + accion + " citas");
        }
    }

    private void validarPropietario(Cita cita) {
        if (contexto.esDoctor() && !cita.getDoctor().getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No tiene acceso a esta cita");
        }
    }

    private void validarAccesoADoctor(Integer idDoctor) {
        if (contexto.esDoctor() && !contexto.doctorActual().getIdDoctor().equals(idDoctor)) {
            throw new AccessDeniedException("No puede operar citas de otro doctor");
        }
    }

    private CatEstadoCita buscarEstadoPorNombre(String nombre) {
        return catEstadoCitaRepository.findByNombre(nombre)
                .orElseThrow(() -> new EntityNotFoundException("Estado de cita no encontrado: " + nombre));
    }

    private void aplicarRelaciones(Cita cita, CitaRequest request) {
        cita.setPaciente(pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente())));
        cita.setDoctor(doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor())));
        cita.setMotivoCita(catMotivoCitaRepository.findById(request.idMotivoCita())
                .orElseThrow(() -> new EntityNotFoundException("Motivo de cita no encontrado: " + request.idMotivoCita())));
        cita.setUsuario(usuarioRepository.findById(request.idUsuario())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuario())));
    }

    private Cita obtenerEntidad(Integer id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada: " + id));
    }
}
