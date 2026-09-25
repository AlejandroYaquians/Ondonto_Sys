package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.ComisionAcumuladaResponse;
import com.ferancheta.odonto_sys.dto.response.ComisionResponse;
import com.ferancheta.odonto_sys.dto.response.PagoComisionResponse;
import com.ferancheta.odonto_sys.entity.Comision;
import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.entity.PagoComision;
import com.ferancheta.odonto_sys.entity.Usuario;
import com.ferancheta.odonto_sys.mapper.ComisionMapper;
import com.ferancheta.odonto_sys.repository.ComisionRepository;
import com.ferancheta.odonto_sys.repository.DoctorRepository;
import com.ferancheta.odonto_sys.repository.PagoComisionRepository;
import com.ferancheta.odonto_sys.security.ContextoAutenticacion;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoComisionService {

    private final ComisionRepository comisionRepository;
    private final PagoComisionRepository pagoComisionRepository;
    private final DoctorRepository doctorRepository;
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
                        pagoComisionRepository.ultimaFechaPagoPorDoctor(doctor.getIdDoctor())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ComisionResponse> listarPendientes(Integer idDoctor) {
        return comisionRepository
                .findByDoctor_IdDoctorAndPagoComisionIsNullOrderByFechaAsc(idDoctor).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PagoComisionResponse> historialPagos(Integer idDoctor) {
        return pagoComisionRepository.historialPagosPorDoctor(idDoctor);
    }

    @Transactional
    public void registrarPago(Integer idDoctor, LocalDate fechaCorte, String numeroReferencia) {
        if (fechaCorte.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de corte no puede ser mayor a la fecha actual.");
        }

        Doctor doctor = doctorRepository.findById(idDoctor)
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado: " + idDoctor));

        List<Comision> pendientes = comisionRepository
                .findByDoctor_IdDoctorAndPagoComisionIsNullAndFechaLessThanEqual(doctor.getIdDoctor(), fechaCorte);

        if (pendientes.isEmpty()) {
            throw new IllegalArgumentException("El doctor no tiene comisiones pendientes hasta la fecha de corte indicada.");
        }

        LocalDateTime momentoPago = LocalDateTime.now();
        Usuario usuarioPago = contexto.usuarioActual();

        BigDecimal montoTotal = pendientes.stream()
                .map(Comision::getMontoComision)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        PagoComision pago = new PagoComision();
        pago.setDoctor(doctor);
        pago.setFechaPago(momentoPago);
        pago.setMontoTotal(montoTotal);
        pago.setNumeroReferencia(numeroReferencia);
        pago.setUsuarioPago(usuarioPago);
        PagoComision pagoGuardado = pagoComisionRepository.save(pago);

        LocalDate periodoDesde = pendientes.stream().map(Comision::getFecha).min(LocalDate::compareTo).orElse(fechaCorte);
        LocalDate periodoHasta = pendientes.stream().map(Comision::getFecha).max(LocalDate::compareTo).orElse(fechaCorte);
        PagoComisionResponse pagoRegistrado = new PagoComisionResponse(
                momentoPago, montoTotal, periodoDesde, periodoHasta,
                usuarioPago.getNombre() + " " + (usuarioPago.getApellido() != null ? usuarioPago.getApellido() : ""),
                numeroReferencia);
        bitacoraService.registrarCambio("pago_comision", pagoGuardado.getIdPagoComision(), "INSERT", null, pagoRegistrado);

        for (Comision comision : pendientes) {
            ComisionResponse antes = mapper.toResponse(comision);
            comision.setPagoComision(pagoGuardado);
            comisionRepository.save(comision);
            bitacoraService.registrarCambio("comision", comision.getIdComision(), "UPDATE", antes, mapper.toResponse(comision));
        }
    }
}
