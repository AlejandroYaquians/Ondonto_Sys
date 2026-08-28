import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BitacoraService } from '../../../core/services/bitacora.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Bitacora } from '../../../core/models/bitacora.models';
import { Usuario } from '../../../core/models/usuario.models';

interface FilaCampo {
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
}

function parsear(json: string | null): Record<string, unknown> {
  if (!json) {
    return {};
  }
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

@Component({
  selector: 'app-bitacora-detalle',
  imports: [RouterLink],
  templateUrl: './bitacora-detalle.component.html'
})
export class BitacoraDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bitacoraService = inject(BitacoraService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly registro = signal<Bitacora | null>(null);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly campos = signal<FilaCampo[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.usuarioService.listar().subscribe((datos) => this.usuarios.set(datos));

    this.bitacoraService.buscarPorId(id).subscribe({
      next: (registro) => {
        this.registro.set(registro);
        this.construirCampos(registro);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  private construirCampos(registro: Bitacora): void {
    const antes = parsear(registro.valorAnterior);
    const despues = parsear(registro.valorNuevo);
    const nombresCampos = new Set([...Object.keys(antes), ...Object.keys(despues)]);

    this.campos.set(
      [...nombresCampos].map((campo) => ({
        campo,
        valorAnterior: this.formatoValor(antes[campo]),
        valorNuevo: this.formatoValor(despues[campo])
      }))
    );
  }

  private formatoValor(valor: unknown): string {
    if (valor === undefined || valor === null) {
      return '—';
    }
    return String(valor);
  }

  nombreUsuario(id: number | null): string {
    if (!id) {
      return '—';
    }
    return this.usuarios().find((u) => u.idUsuario === id)?.nombre ?? `#${id}`;
  }

  formatoFecha(fecha: string): string {
    return fecha.slice(0, 19).replace('T', ' ');
  }
}
