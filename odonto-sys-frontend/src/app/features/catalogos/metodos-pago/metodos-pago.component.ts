import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { CatMetodoPago } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-metodos-pago',
  imports: [ReactiveFormsModule],
  templateUrl: './metodos-pago.component.html'
})
export class MetodosPagoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly items = signal<CatMetodoPago[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    comisionPorcentaje: [null as number | null]
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.metodosPago().subscribe({
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
    this.formulario.reset({ nombre: '', comisionPorcentaje: null });
    this.mostrarFormulario.set(true);
  }

  editar(item: CatMetodoPago): void {
    this.idEditando.set(item.idMetodoPago);
    this.formulario.setValue({ nombre: item.nombre, comisionPorcentaje: item.comisionPorcentaje });
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
    const request = { nombre: valores.nombre ?? '', comisionPorcentaje: valores.comisionPorcentaje };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarMetodoPago(id, request)
      : this.catalogosService.crearMetodoPago(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: CatMetodoPago): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarMetodoPago(item.idMetodoPago).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
