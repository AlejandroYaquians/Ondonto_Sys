package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.ComisionAcumuladaResponse;
import com.ferancheta.odonto_sys.dto.response.ComisionResponse;
import com.ferancheta.odonto_sys.dto.response.PagoComisionResponse;
import com.ferancheta.odonto_sys.entity.Comision;
import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.entity.EstadoComision;
import com.ferancheta.odonto_sys.mapper.ComisionMapper;
import com.ferancheta.odonto_sys.repository.ComisionRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.EstadoComisionRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoComisionService {

    private static final String ESTADO_PENDIENTE = "Pendiente";
    private static final String ESTADO_PAGADA = "Pagada";

    private final ComisionRepository comisionRepository;
    private final DoctorRepository doctorRepository;
    private final EstadoComisionRepository estadoComisionRepository;
    private final ContextoAutenticacion contexto;
    private final BitacoraService bitacoraService;
    private final ComisionMapper mapper;

    @Transactional(readOnly = true)
    public List<ComisionAcumuladaResponse> listarAcumuladoPorDoctor() {
        return doctorRepository.findByActivoTrue().stream()
                .map(doctor -> new ComisionAcumuladaResponse(
                        doctor.getIdDoctor(),
                        doctor.getNombre() + " " + doctor.getApellido(),
                        comisionRepository.sumarPendientePorDoctor(doctor.getIdDoctor()),
                        comisionRepository.ultimaFechaPagoPorDoctor(doctor.getIdDoctor())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ComisionResponse> listarPendientes(Integer idDoctor) {
        return comisionRepository
                .findByDoctor_IdDoctorAndEstadoComision_NombreIgnoreCaseOrderByFechaAsc(idDoctor, ESTADO_PENDIENTE).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PagoComisionResponse> historialPagos(Integer idDoctor) {
        return comisionRepository.historialPagosPorDoctor(idDoctor);
    }

    @Transactional
    public void registrarPago(Integer idDoctor, LocalDate fechaCorte) {
        if (fechaCorte.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de corte no puede ser mayor a la fecha actual.");
        }

        Doctor doctor = doctorRepository.findById(idDoctor)
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + idDoctor));

        List<Comision> pendientes = comisionRepository
                .findByDoctor_IdDoctorAndEstadoComision_NombreIgnoreCaseAndFechaLessThanEqual(
                        doctor.getIdDoctor(), ESTADO_PENDIENTE, fechaCorte);

        EstadoComision estadoPagada = estadoComisionRepository.findByNombreIgnoreCase(ESTADO_PAGADA)
                .orElseThrow(() -> new EntityNotFoundException("Estado de comisión no encontrado: " + ESTADO_PAGADA));
        LocalDateTime momentoPago = LocalDateTime.now();

        for (Comision comision : pendientes) {
            ComisionResponse antes = mapper.toResponse(comision);
            comision.setEstadoComision(estadoPagada);
            comision.setFechaPago(momentoPago);
            comision.setUsuarioPago(contexto.usuarioActual());
            comisionRepository.save(comision);
            bitacoraService.registrarCambio("comision", comision.getIdComision(), "UPDATE", antes, mapper.toResponse(comision));
        }
    }
}
