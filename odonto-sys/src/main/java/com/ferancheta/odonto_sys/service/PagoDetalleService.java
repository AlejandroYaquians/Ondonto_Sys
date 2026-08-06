package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.PagoDetalleRequest;
import com.ferancheta.odonto_sys.dto.response.PagoDetalleResponse;
import com.ferancheta.odonto_sys.entity.CatMetodoPago;
import com.ferancheta.odonto_sys.entity.ConsultaTratamiento;
import com.ferancheta.odonto_sys.entity.PagoDetalle;
import com.ferancheta.odonto_sys.mapper.PagoDetalleMapper;
import com.ferancheta.odonto_sys.repository.CatMetodoPagoRepository;
import com.ferancheta.odonto_sys.repository.ConsultaTratamientoRepository;
import com.ferancheta.odonto_sys.repository.PagoDetalleRepository;
import com.ferancheta.odonto_sys.repository.PagoRepository;
import com.ferancheta.odonto_sys.repository.ServicioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoDetalleService {

    private static final int ESCALA = 2;

    private final PagoDetalleRepository repository;
    private final PagoRepository pagoRepository;
    private final ServicioRepository servicioRepository;
    private final CatMetodoPagoRepository catMetodoPagoRepository;
    private final ConsultaTratamientoRepository consultaTratamientoRepository;
    private final PagoDetalleMapper mapper;

    @Transactional(readOnly = true)
    public List<PagoDetalleResponse> listarPorPago(Integer idPago) {
        return repository.findByPago_IdPago(idPago).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PagoDetalleResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public PagoDetalleResponse crear(PagoDetalleRequest request) {
        PagoDetalle entidad = mapper.toEntity(request);
        aplicarRelaciones(entidad, request);
        entidad.setComisionDoctorCalculada(calcularComisionDoctor(entidad));
        return mapper.toResponse(repository.save(entidad));
    }

    @Transactional
    public PagoDetalleResponse actualizar(Integer id, PagoDetalleRequest request) {
        PagoDetalle existente = obtenerEntidad(id);
        PagoDetalle actualizado = mapper.toEntity(request);
        actualizado.setIdDetallePago(existente.getIdDetallePago());
        aplicarRelaciones(actualizado, request);
        actualizado.setComisionDoctorCalculada(calcularComisionDoctor(actualizado));
        return mapper.toResponse(repository.save(actualizado));
    }

    @Transactional
    public void eliminar(Integer id) {
        repository.delete(obtenerEntidad(id));
    }

    private BigDecimal calcularComisionDoctor(PagoDetalle detalle) {
        CatMetodoPago metodoPago = detalle.getMetodoPago();
        BigDecimal comisionPorcentajeBanco = metodoPago.getComisionPorcentaje() != null
                ? metodoPago.getComisionPorcentaje()
                : BigDecimal.ZERO;

        BigDecimal comisionTarjeta = detalle.getPrecioAplicado()
                .multiply(comisionPorcentajeBanco)
                .divide(BigDecimal.valueOf(100), ESCALA, RoundingMode.HALF_UP);

        BigDecimal costoLaboratorio = detalle.getCostoLaboratorio() != null
                ? detalle.getCostoLaboratorio()
                : BigDecimal.ZERO;

        BigDecimal montoNeto = detalle.getPrecioAplicado()
                .subtract(costoLaboratorio)
                .subtract(comisionTarjeta);

        ConsultaTratamiento consultaTratamiento = detalle.getConsultaTratamiento();
        BigDecimal porcentajeComisionDoctor = consultaTratamiento.getConsulta().getDoctor().getPorcentajeComision();

        return montoNeto
                .multiply(porcentajeComisionDoctor)
                .divide(BigDecimal.valueOf(100), ESCALA, RoundingMode.HALF_UP);
    }

    private void aplicarRelaciones(PagoDetalle entidad, PagoDetalleRequest request) {
        entidad.setPago(pagoRepository.findById(request.idPago())
                .orElseThrow(() -> new EntityNotFoundException("Pago no encontrado: " + request.idPago())));
        entidad.setServicio(servicioRepository.findById(request.idServicio())
                .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado: " + request.idServicio())));
        entidad.setMetodoPago(catMetodoPagoRepository.findById(request.idMetodoPago())
                .orElseThrow(() -> new EntityNotFoundException("Método de pago no encontrado: " + request.idMetodoPago())));
        entidad.setConsultaTratamiento(consultaTratamientoRepository.findById(request.idConsultaTratamiento())
                .orElseThrow(() -> new EntityNotFoundException("Consulta tratamiento no encontrada: " + request.idConsultaTratamiento())));
    }

    private PagoDetalle obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Detalle de pago no encontrado: " + id));
    }
}
