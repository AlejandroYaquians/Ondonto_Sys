import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BitacoraService } from '../../core/services/bitacora.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Bitacora } from '../../core/models/bitacora.models';
import { Usuario } from '../../core/models/usuario.models';

@Component({
  selector: 'app-bitacora',
  imports: [ReactiveFormsModule],
  templateUrl: './bitacora.component.html'
})
export class BitacoraComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bitacoraService = inject(BitacoraService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly registros = signal<Bitacora[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly busquedaRealizada = signal(false);

  protected readonly formularioUsuario = this.fb.group({
    idUsuario: [null as number | null]
  });

  protected readonly formularioRegistro = this.fb.group({
    tablaAfectada: [''],
    idRegistro: [null as number | null]
  });

  ngOnInit(): void {
    this.usuarioService.listar().subscribe((datos) => this.usuarios.set(datos));
  }

  nombreUsuario(id: number | null): string {
    if (!id) {
      return '—';
    }
    return this.usuarios().find((u) => u.idUsuario === id)?.nombre ?? `#${id}`;
  }

  buscarPorUsuario(): void {
    const idUsuario = this.formularioUsuario.getRawValue().idUsuario;
    if (!idUsuario) {
      return;
    }
    this.buscar(this.bitacoraService.listarPorUsuario(idUsuario));
  }

  buscarPorRegistro(): void {
    const valores = this.formularioRegistro.getRawValue();
    if (!valores.tablaAfectada || !valores.idRegistro) {
      return;
    }
    this.buscar(this.bitacoraService.listarPorRegistro(valores.tablaAfectada, valores.idRegistro));
  }

  private buscar(fuente: ReturnType<BitacoraService['listarPorUsuario']>): void {
    this.cargando.set(true);
    this.error.set(null);
    fuente.subscribe({
      next: (datos) => {
        this.registros.set(datos.sort((a, b) => b.fechaHora.localeCompare(a.fechaHora)));
        this.busquedaRealizada.set(true);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  formatoFecha(fecha: string): string {
    return fecha.slice(0, 19).replace('T', ' ');
  }
}
