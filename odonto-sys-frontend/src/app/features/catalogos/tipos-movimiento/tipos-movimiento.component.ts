import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { CatMovimiento } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-tipos-movimiento',
  imports: [ReactiveFormsModule],
  templateUrl: './tipos-movimiento.component.html'
})
export class TiposMovimientoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly items = signal<CatMovimiento[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nombreMovimiento: ['', Validators.required],
    operacion: [null as boolean | null, Validators.required]
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.tiposMovimiento().subscribe({
      next: (datos) => {
        this.items.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({ nombreMovimiento: '', operacion: null });
    this.mostrarFormulario.set(true);
  }

  editar(item: CatMovimiento): void {
    this.idEditando.set(item.idTipoMovimiento);
    this.formulario.setValue({ nombreMovimiento: item.nombreMovimiento, operacion: item.operacion });
    this.mostrarFormulario.set(true);
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
    this.idEditando.set(null);
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const request = { nombreMovimiento: valores.nombreMovimiento ?? '', operacion: valores.operacion as boolean };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarTipoMovimiento(id, request)
      : this.catalogosService.crearTipoMovimiento(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: CatMovimiento): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarTipoMovimiento(item.idTipoMovimiento).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
