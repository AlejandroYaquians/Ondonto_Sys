import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InstrumentalService } from '../../../core/services/instrumental.service';
import { InstrumentalMovimientoService } from '../../../core/services/instrumental-movimiento.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Instrumental, InstrumentalMovimiento } from '../../../core/models/instrumental.models';
import { CatMovimiento } from '../../../core/models/catalogo.models';
import { Usuario } from '../../../core/models/usuario.models';

@Component({
  selector: 'app-inventario-historial',
  imports: [RouterLink],
  templateUrl: './inventario-historial.component.html'
})
export class InventarioHistorialComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly instrumentalService = inject(InstrumentalService);
  private readonly movimientoService = inject(InstrumentalMovimientoService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly instrumental = signal<Instrumental | null>(null);
  protected readonly tiposMovimiento = signal<CatMovimiento[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly movimientos = signal<InstrumentalMovimiento[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.catalogosService.tiposMovimiento().subscribe((datos) => this.tiposMovimiento.set(datos));
    this.usuarioService.listar().subscribe((datos) => this.usuarios.set(datos));
    this.instrumentalService.buscarPorId(id).subscribe((item) => this.instrumental.set(item));

    this.movimientoService.listarPorInstrumental(id).subscribe({
      next: (datos) => {
        this.movimientos.set(datos.sort((a, b) => b.fecha.localeCompare(a.fecha)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreTipoMovimiento(id: number): string {
    return this.tiposMovimiento().find((t) => t.idTipoMovimiento === id)?.nombreMovimiento ?? `#${id}`;
  }

  nombreUsuario(idUsuario: number): string {
    return this.usuarios().find((u) => u.idUsuario === idUsuario)?.nombre ?? `#${idUsuario}`;
  }

  esEntrada(id: number): boolean {
    return this.tiposMovimiento().find((t) => t.idTipoMovimiento === id)?.operacion === true;
  }

  formatoFecha(fecha: string): string {
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }
}
