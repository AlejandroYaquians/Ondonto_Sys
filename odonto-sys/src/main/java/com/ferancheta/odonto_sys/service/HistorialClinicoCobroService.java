package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.HistorialClinicoCobroRequest;
import com.ferancheta.odonto_sys.dto.response.CobroResponse;
import com.ferancheta.odonto_sys.dto.response.HistorialClinicoCobroResponse;
import com.ferancheta.odonto_sys.entity.EstadoCita;
import com.ferancheta.odonto_sys.entity.Cita;
import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.entity.HistorialClinico;
import com.ferancheta.odonto_sys.entity.Paciente;
import com.ferancheta.odonto_sys.entity.Receta;
import com.ferancheta.odonto_sys.entity.Servicio;
import com.ferancheta.odonto_sys.mapper.HistorialClinicoMapper;
import com.ferancheta.odonto_sys.repository.EstadoCitaRepository;
import com.ferancheta.odonto_sys.repository.CitaRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.HistorialClinicoRepository;
import com.ferancheta.odonto_sys.repository.PacienteRepository;
import com.ferancheta.odonto_sys.repository.RecetaRepository;
import com.ferancheta.odonto_sys.repository.ServicioRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class HistorialClinicoCobroService {

    private static final String ESTADO_ATENDIDA = "Atendida";

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final DoctorRepository doctorRepository;
    private final ServicioRepository servicioRepository;
    private final HistorialClinicoRepository historialClinicoRepository;
    private final RecetaRepository recetaRepository;
    private final EstadoCitaRepository estadoCitaRepository;
    private final ContextoAutenticacion contexto;
    private final BitacoraService bitacoraService;
    private final HistorialClinicoMapper historialClinicoMapper;
    private final CobroService cobroService;

    @Transactional
    public HistorialClinicoCobroResponse registrar(HistorialClinicoCobroRequest request) {
        Paciente paciente = pacienteRepository.findById(request.idPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado: " + request.idPaciente()));
        Doctor doctor = doctorRepository.findById(request.idDoctor())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + request.idDoctor()));

        if (contexto.esDoctor() && !doctor.getIdDoctor().equals(contexto.doctorActual().getIdDoctor())) {
            throw new AccessDeniedException("No puede registrar historial clínico de otro doctor");
        }

        Cita cita = null;
        if (request.idCita() != null) {
            cita = citaRepository.findById(request.idCita())
                    .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada: " + request.idCita()));
        }

        HistorialClinico historial = new HistorialClinico();
        historial.setDescripcion(request.descripcion());
        historial.setPaciente(paciente);
        historial.setDoctor(doctor);
        historial.setCita(cita);
        historial.setIdUsuarioCreacion(contexto.usuarioActual().getIdUsuario());
        HistorialClinico historialGuardado = historialClinicoRepository.save(historial);

        if (request.medicamento() != null && !request.medicamento().isBlank()) {
            Receta receta = new Receta();
            receta.setMedicamento(request.medicamento());
            receta.setDosis(request.dosis());
            receta.setFrecuencia(request.frecuencia());
            receta.setDuracion(request.duracion());
            receta.setIndicaciones(request.indicaciones());
            receta.setFecha(LocalDate.now());
            receta.setHistorialClinico(historialGuardado);
            recetaRepository.save(receta);
        }

        Servicio servicio = servicioRepository.findById(request.idServicio())
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado: " + request.idServicio()));

        CobroResponse cobro = cobroService.registrarCobro(paciente, cita, doctor, servicio, servicio.getCostoBase(),
                request.costoLaboratorio(), request.montoEfectivo(), request.montoTarjeta(),
                request.idMetodoPago(), historialGuardado);

        if (cita != null) {
            EstadoCita atendida = estadoCitaRepository.findByNombre(ESTADO_ATENDIDA)
                    .orElseThrow(() -> new EntityNotFoundException("Estado de cita no encontrado: " + ESTADO_ATENDIDA));
            cita.setEstadoCita(atendida);
            citaRepository.save(cita);
        }

        bitacoraService.registrarCambio("historial_clinico", historialGuardado.getIdHistorialClinico(), "INSERT",
                null, historialClinicoMapper.toResponse(historialGuardado));

        return new HistorialClinicoCobroResponse(
                historialGuardado.getIdHistorialClinico(),
                cobro.idCobro(),
                cobro.codigoCobro(),
                cobro.montoBruto(),
                cobro.comisionTarjeta(),
                cobro.montoNeto(),
                cobro.comisionDoctor());
    }
}
