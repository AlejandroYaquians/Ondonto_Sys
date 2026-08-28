package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.response.ReporteFinancieroResponse;
import com.ferancheta.odonto_sys.entity.Comision;
import com.ferancheta.odonto_sys.entity.Doctor;
import com.ferancheta.odonto_sys.entity.Gasto;
import com.ferancheta.odonto_sys.entity.Cobro;
import com.ferancheta.odonto_sys.repository.CobroRepository;
import com.ferancheta.odonto_sys.repository.ComisionRepository;
import com.ferancheta.odonto_sys.repository.GastoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteFinancieroService {

    private static final String ESTADO_ANULADO = "anulado";
    private static final String TIPO_FIJO = "Fijo";
    private static final String TIPO_VARIABLE = "Variable";

    private final CobroRepository cobroRepository;
    private final ComisionRepository comisionRepository;
    private final GastoRepository gastoRepository;

    @Transactional(readOnly = true)
    public ReporteFinancieroResponse generar(LocalDate desde, LocalDate hasta) {
        List<Cobro> cobros = obtenerCobrosVigentes(desde, hasta);

        BigDecimal ingresosBrutos = sumar(cobros, Cobro::getMontoBruto);
        BigDecimal cobroEfectivo = sumar(cobros, Cobro::getMontoEfectivo);
        BigDecimal cobroTarjeta = sumar(cobros, Cobro::getMontoTarjeta);
        BigDecimal comisionBancaria = sumar(cobros, Cobro::getComisionTarjeta);
        BigDecimal costoLaboratorio = sumar(cobros, Cobro::getCostoLaboratorio);
        BigDecimal montoNeto = sumar(cobros, Cobro::getMontoNeto);

        List<ReporteFinancieroResponse.ComisionDoctorItem> comisionesPorDoctor = obtenerComisionesPorDoctor(desde, hasta);

        List<Gasto> gastos = gastoRepository.findByFechaBetween(desde, hasta);
        BigDecimal gastosFijos = sumarGastosPorTipo(gastos, TIPO_FIJO);
        BigDecimal gastosVariables = sumarGastosPorTipo(gastos, TIPO_VARIABLE);

        BigDecimal gananciaNeta = montoNeto.subtract(gastosFijos).subtract(gastosVariables);

        return new ReporteFinancieroResponse(
                ingresosBrutos, cobroEfectivo, cobroTarjeta, comisionBancaria, costoLaboratorio, montoNeto,
                gastosFijos, gastosVariables, gananciaNeta, comisionesPorDoctor);
    }

    @Transactional(readOnly = true)
    public byte[] generarCsv(LocalDate desde, LocalDate hasta) {
        ReporteFinancieroResponse reporte = generar(desde, hasta);

        StringBuilder csv = new StringBuilder("﻿");
        csv.append("Cierre de caja,").append(desde).append(" a ").append(hasta).append("\n\n");
        csv.append("Concepto,Monto\n");
        csv.append("Ingresos brutos,").append(reporte.ingresosBrutos()).append("\n");
        csv.append("Cobro efectivo,").append(reporte.cobroEfectivo()).append("\n");
        csv.append("Cobro tarjeta,").append(reporte.cobroTarjeta()).append("\n");
        csv.append("Comisión bancaria,").append(reporte.comisionBancaria()).append("\n");
        csv.append("Costo laboratorio,").append(reporte.costoLaboratorio()).append("\n");
        csv.append("Monto neto,").append(reporte.montoNeto()).append("\n");
        csv.append("Gastos fijos,").append(reporte.gastosFijos()).append("\n");
        csv.append("Gastos variables,").append(reporte.gastosVariables()).append("\n");
        csv.append("Ganancia neta,").append(reporte.gananciaNeta()).append("\n\n");

        csv.append("Comisiones por doctor\n");
        csv.append("Doctor,Porcentaje,Monto comisión\n");
        for (ReporteFinancieroResponse.ComisionDoctorItem item : reporte.comisionesPorDoctor()) {
            csv.append(item.nombreDoctor()).append(",")
                    .append(item.porcentaje()).append("%,")
                    .append(item.montoComision()).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private List<Cobro> obtenerCobrosVigentes(LocalDate desde, LocalDate hasta) {
        LocalDateTime desdeFecha = LocalDateTime.of(desde, LocalTime.MIN);
        LocalDateTime hastaFecha = LocalDateTime.of(hasta, LocalTime.MAX);
        return cobroRepository.findByFechaBetween(desdeFecha, hastaFecha).stream()
                .filter(c -> !ESTADO_ANULADO.equals(c.getEstado()))
                .toList();
    }

    private List<ReporteFinancieroResponse.ComisionDoctorItem> obtenerComisionesPorDoctor(LocalDate desde, LocalDate hasta) {
        Map<Integer, List<Comision>> porDoctor = comisionRepository.findByFechaBetween(desde, hasta).stream()
                .collect(Collectors.groupingBy(c -> c.getDoctor().getIdDoctor()));

        return porDoctor.values().stream()
                .map(comisionesDelDoctor -> {
                    Doctor doctor = comisionesDelDoctor.get(0).getDoctor();
                    BigDecimal total = comisionesDelDoctor.stream()
                            .map(Comision::getMontoComision)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new ReporteFinancieroResponse.ComisionDoctorItem(
                            doctor.getIdDoctor(),
                            doctor.getNombre() + " " + doctor.getApellido(),
                            total,
                            doctor.getPorcentajeComision());
                })
                .sorted(Comparator.comparing(ReporteFinancieroResponse.ComisionDoctorItem::nombreDoctor))
                .toList();
    }

    private BigDecimal sumarGastosPorTipo(List<Gasto> gastos, String tipo) {
        return gastos.stream()
                .filter(g -> tipo.equalsIgnoreCase(g.getTipoGasto().getTipo()))
                .map(Gasto::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumar(List<Cobro> cobros, Function<Cobro, BigDecimal> extractor) {
        return cobros.stream()
                .map(extractor)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
