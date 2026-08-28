import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsumoService } from '../../../core/services/insumo.service';
import { AuthService } from '../../../core/services/auth.service';
import { Insumo } from '../../../core/models/insumo.models';

@Component({
  selector: 'app-insumos',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './insumos.component.html'
})
export class InsumosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly insumoService = inject(InsumoService);
  private readonly authService = inject(AuthService);

  protected readonly items = signal<Insumo[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);
  protected readonly idEditandoStockMinimo = signal<number | null>(null);

  protected readonly esAdmin = computed(() => this.authService.rol() === 'ADMIN');

  protected readonly insumosConStockBajo = computed(() => this.items().filter(this.tieneStockBajo));

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    unidadMedida: [''],
    stockActual: [0 as number | null],
    stockMinimo: [0 as number | null, Validators.required]
  });

  protected readonly formularioStockMinimo = this.fb.group({
    stockMinimo: [0 as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.insumoService.listarActivos().subscribe({
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

  tieneStockBajo(item: Insumo): boolean {
    return item.stockActual !== null && item.stockMinimo !== null && item.stockActual <= item.stockMinimo;
  }

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({ nombre: '', descripcion: '', unidadMedida: '', stockActual: 0, stockMinimo: 0 });
    this.mostrarFormulario.set(true);
  }

  editar(item: Insumo): void {
    this.idEditando.set(item.idInsumo);
    this.formulario.setValue({
      nombre: item.nombre,
      descripcion: item.descripcion ?? '',
      unidadMedida: item.unidadMedida ?? '',
      stockActual: item.stockActual,
      stockMinimo: item.stockMinimo
    });
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
    const request = {
      nombre: valores.nombre ?? '',
      descripcion: valores.descripcion || null,
      unidadMedida: valores.unidadMedida || null,
      stockActual: valores.stockActual,
      stockMinimo: valores.stockMinimo
    };

    const id = this.idEditando();
    const operacion = id ? this.insumoService.actualizar(id, request) : this.insumoService.crear(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  editarStockMinimo(item: Insumo): void {
    this.idEditandoStockMinimo.set(item.idInsumo);
    this.formularioStockMinimo.setValue({ stockMinimo: item.stockMinimo });
  }

  cancelarStockMinimo(): void {
    this.idEditandoStockMinimo.set(null);
  }

  guardarStockMinimo(item: Insumo): void {
    if (this.formularioStockMinimo.invalid) {
      return;
    }
    const stockMinimo = this.formularioStockMinimo.getRawValue().stockMinimo as number;
    this.insumoService.actualizarStockMinimo(item.idInsumo, stockMinimo).subscribe({
      next: () => {
        this.idEditandoStockMinimo.set(null);
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: Insumo): void {
    if (!window.confirm(`¿Desea inactivar "${item.nombre}"?`)) {
      return;
    }
    this.insumoService.eliminar(item.idInsumo).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
