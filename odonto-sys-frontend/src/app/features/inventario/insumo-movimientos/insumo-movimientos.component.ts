import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsumoService } from '../../../core/services/insumo.service';
import { InsumoMovimientoService } from '../../../core/services/insumo-movimiento.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AuthService } from '../../../core/services/auth.service';
import { Insumo, InsumoMovimiento } from '../../../core/models/insumo.models';
import { CatMovimiento } from '../../../core/models/catalogo.models';

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
  private readonly authService = inject(AuthService);

  protected readonly insumos = signal<Insumo[]>([]);
  protected readonly tiposMovimiento = signal<CatMovimiento[]>([]);
  protected readonly movimientos = signal<InsumoMovimiento[]>([]);
  protected readonly idInsumoSeleccionado = signal<number | null>(null);
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

    const idInsumo = this.route.snapshot.queryParamMap.get('idInsumo');
    if (idInsumo) {
      this.seleccionarInsumo(Number(idInsumo));
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

  esEntrada(id: number): boolean {
    return this.tiposMovimiento().find((t) => t.idTipoMovimiento === id)?.operacion === true;
  }

  nuevo(): void {
    this.formulario.reset({ idTipoMovimiento: null, cantidad: null, motivo: '' });
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
    const idUsuario = this.authService.idUsuario();
    if (!idInsumo || !idUsuario) {
      this.error.set('Error al guardar.');
      return;
    }

    const valores = this.formulario.getRawValue();
    const request = {
      cantidad: valores.cantidad as number,
      motivo: valores.motivo || null,
      idInsumo,
      idTipoMovimiento: valores.idTipoMovimiento as number,
      idGasto: null,
      idUsuario
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
