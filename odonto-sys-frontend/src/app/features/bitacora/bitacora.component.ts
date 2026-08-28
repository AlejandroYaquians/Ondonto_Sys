import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BitacoraService } from '../../core/services/bitacora.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Bitacora } from '../../core/models/bitacora.models';
import { Usuario } from '../../core/models/usuario.models';

const TABLAS_AUDITADAS = ['paciente', 'historial_clinico', 'cobro', 'comision', 'usuario', 'doctor'];

@Component({
  selector: 'app-bitacora',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './bitacora.component.html'
})
export class BitacoraComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bitacoraService = inject(BitacoraService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly tablas = TABLAS_AUDITADAS;
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly registros = signal<Bitacora[]>([]);
  protected readonly pagina = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly filtros = this.fb.group({
    idUsuario: [null as number | null],
    tablaAfectada: [''],
    desde: [''],
    hasta: ['']
  });

  ngOnInit(): void {
    this.usuarioService.listar().subscribe((datos) => this.usuarios.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    const valores = this.filtros.getRawValue();

    this.bitacoraService
      .listar(this.pagina(), valores.idUsuario, valores.tablaAfectada || null, valores.desde || null, valores.hasta || null)
      .subscribe({
        next: (pagina) => {
          this.registros.set(pagina.content);
          this.totalPaginas.set(pagina.page.totalPages);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('Error al cargar.');
          this.cargando.set(false);
        }
      });
  }

  aplicarFiltros(): void {
    this.pagina.set(0);
    this.cargar();
  }

  paginaAnterior(): void {
    if (this.pagina() > 0) {
      this.pagina.set(this.pagina() - 1);
      this.cargar();
    }
  }

  paginaSiguiente(): void {
    if (this.pagina() + 1 < this.totalPaginas()) {
      this.pagina.set(this.pagina() + 1);
      this.cargar();
    }
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
