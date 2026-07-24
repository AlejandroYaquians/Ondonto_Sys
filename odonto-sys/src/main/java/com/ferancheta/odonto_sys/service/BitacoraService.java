package com.ferancheta.odonto_sys.service;

import com.ferancheta.odonto_sys.dto.request.BitacoraRequest;
import com.ferancheta.odonto_sys.dto.response.BitacoraResponse;
import com.ferancheta.odonto_sys.entity.Bitacora;
import com.ferancheta.odonto_sys.mapper.BitacoraMapper;
import com.ferancheta.odonto_sys.repository.BitacoraRepository;
import com.ferancheta.odonto_sys.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BitacoraService {

    private final BitacoraRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final BitacoraMapper mapper;

    @Transactional(readOnly = true)
    public List<BitacoraResponse> listarPorRegistro(String tablaAfectada, Integer idRegistro) {
        return repository.findByTablaAfectadaAndIdRegistroOrderByFechaHoraDesc(tablaAfectada, idRegistro)
                .stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<BitacoraResponse> listarPorUsuario(Integer idUsuario) {
        return repository.findByUsuario_IdUsuario(idUsuario).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public BitacoraResponse buscarPorId(Integer id) {
        return mapper.toResponse(obtenerEntidad(id));
    }

    @Transactional
    public BitacoraResponse crear(BitacoraRequest request) {
        Bitacora entidad = mapper.toEntity(request);

        if (request.idUsuario() != null) {
            entidad.setUsuario(usuarioRepository.findById(request.idUsuario())
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + request.idUsuario())));
        }

        return mapper.toResponse(repository.save(entidad));
    }

    private Bitacora obtenerEntidad(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Registro de bitácora no encontrado: " + id));
    }
}
