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

    private static final String ESTADO_ANULADO = "Anulado";
    private static final String TIPO_FIJO = "Fijo";
    private static final String TIPO_VARIABLE = "Variable";

    private final CobroRepository cobroRepository;
    private final ComisionRepository comisionRepository;
    private final GastoRepository gastoRepository;

    @Transactional(readOnly = true)
    public ReporteFinancieroResponse generar(LocalDate desde, LocalDate hasta) {
        LocalDateTime desdeFecha = LocalDateTime.of(desde, LocalTime.MIN);
        LocalDateTime hastaFecha = LocalDateTime.of(hasta, LocalTime.MAX);
        List<Cobro> todosLosCobros = cobroRepository.findByFechaBetween(desdeFecha, hastaFecha);

        List<Cobro> cobrosAnulados = todosLosCobros.stream()
                .filter(c -> ESTADO_ANULADO.equalsIgnoreCase(c.getEstadoCobro().getNombre()))
                .toList();
        List<Cobro> cobros = todosLosCobros.stream()
                .filter(c -> !ESTADO_ANULADO.equalsIgnoreCase(c.getEstadoCobro().getNombre()))
                .toList();

        BigDecimal ingresosBrutos = sumar(cobros, Cobro::getMontoBruto);
        BigDecimal cobroEfectivo = sumar(cobros, Cobro::getMontoEfectivo);
        BigDecimal cobroTarjeta = sumar(cobros, Cobro::getMontoTarjeta);
        BigDecimal comisionBancaria = sumar(cobros, Cobro::getComisionTarjeta);
        BigDecimal costoLaboratorio = sumar(cobros, Cobro::getCostoLaboratorio);
        BigDecimal montoNeto = sumar(cobros, Cobro::getMontoNeto);
        BigDecimal montoCobrosAnulados = sumar(cobrosAnulados, Cobro::getMontoBruto);

        List<ReporteFinancieroResponse.ComisionDoctorItem> comisionesPorDoctor = obtenerComisionesPorDoctor(desde, hasta);

        List<Gasto> gastos = gastoRepository.findByFechaBetween(desde, hasta);
        BigDecimal gastosFijos = sumarGastosPorTipo(gastos, TIPO_FIJO);
        BigDecimal gastosVariables = sumarGastosPorTipo(gastos, TIPO_VARIABLE);

        BigDecimal gananciaNeta = montoNeto.subtract(gastosFijos).subtract(gastosVariables);

        return new ReporteFinancieroResponse(
                ingresosBrutos, cobroEfectivo, cobroTarjeta, comisionBancaria, costoLaboratorio, montoNeto,
                gastosFijos, gastosVariables, gananciaNeta,
                cobros.size(), cobrosAnulados.size(), montoCobrosAnulados,
                comisionesPorDoctor);
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
