import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsumoService } from '../../../core/services/insumo.service';
import { InsumoMovimientoService } from '../../../core/services/insumo-movimiento.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Insumo, InsumoMovimiento } from '../../../core/models/insumo.models';
import { CatMovimiento } from '../../../core/models/catalogo.models';
import { Usuario } from '../../../core/models/usuario.models';

const TIPO_COMPRA_INSUMOS = 'Compra de insumos';

@Component({
  selector: 'app-insumo-movimientos',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './insumo-movimientos.component.html'
})
export class InsumoMovimientosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly insumoService = inject(InsumoService);
  private readonly movimientoService = inject(InsumoMovimientoService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly insumos = signal<Insumo[]>([]);
  protected readonly tiposMovimiento = signal<CatMovimiento[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly movimientos = signal<InsumoMovimiento[]>([]);
  protected readonly idInsumoSeleccionado = signal<number | null>(null);
  protected readonly modoEntrada = signal(false);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);

  protected readonly formulario = this.fb.group({
    idTipoMovimiento: [null as number | null, Validators.required],
    cantidad: [null as number | null, [Validators.required, Validators.min(1)]],
    motivo: ['']
  });

  ngOnInit(): void {
    this.insumoService.listar().subscribe((datos) => this.insumos.set(datos));
    this.catalogosService.tiposMovimiento().subscribe((datos) => this.tiposMovimiento.set(datos));
    this.usuarioService.listar().subscribe((datos) => this.usuarios.set(datos));

    this.modoEntrada.set(this.route.snapshot.queryParamMap.get('entrada') === '1');

    const idInsumo = this.route.snapshot.queryParamMap.get('idInsumo');
    if (idInsumo) {
      this.seleccionarInsumo(Number(idInsumo));
      if (this.modoEntrada()) {
        this.nuevo();
      }
    }
  }

  seleccionarInsumo(idInsumo: number | null): void {
    this.idInsumoSeleccionado.set(idInsumo);
    this.mostrarFormulario.set(false);
    if (idInsumo) {
      this.cargar(idInsumo);
    } else {
      this.movimientos.set([]);
    }
  }

  private cargar(idInsumo: number): void {
    this.cargando.set(true);
    this.movimientoService.listarPorInsumo(idInsumo).subscribe({
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

  nombreInsumo(idInsumo: number): string {
    return this.insumos().find((i) => i.idInsumo === idInsumo)?.nombre ?? `#${idInsumo}`;
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

  nuevo(): void {
    const idTipoCompra = this.modoEntrada()
      ? this.tiposMovimiento().find((t) => t.nombreMovimiento === TIPO_COMPRA_INSUMOS)?.idTipoMovimiento ?? null
      : null;
    this.formulario.reset({ idTipoMovimiento: idTipoCompra, cantidad: null, motivo: '' });
    if (this.modoEntrada()) {
      this.formulario.controls.idTipoMovimiento.disable();
    } else {
      this.formulario.controls.idTipoMovimiento.enable();
    }
    this.mostrarFormulario.set(true);
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const idInsumo = this.idInsumoSeleccionado();
    if (!idInsumo) {
      this.error.set('Error al guardar.');
      return;
    }

    const valores = this.formulario.getRawValue();
    const request = {
      cantidad: valores.cantidad as number,
      motivo: valores.motivo || null,
      idInsumo,
      idTipoMovimiento: valores.idTipoMovimiento as number
    };

    this.movimientoService.crear(request).subscribe({
      next: () => {
        this.cancelar();
        this.cargar(idInsumo);
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: InsumoMovimiento): void {
    if (!window.confirm('¿Desea eliminar este movimiento? El stock se revertirá.')) {
      return;
    }
    this.movimientoService.eliminar(item.idMovimiento).subscribe({
      next: () => this.cargar(item.idInsumo),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
