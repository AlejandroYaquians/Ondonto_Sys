import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { CatTratamiento } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-tratamientos',
  imports: [ReactiveFormsModule],
  templateUrl: './tratamientos.component.html'
})
export class TratamientosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly items = signal<CatTratamiento[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.tratamientos().subscribe({
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
    this.formulario.reset({ nombre: '', descripcion: '' });
    this.mostrarFormulario.set(true);
  }

  editar(item: CatTratamiento): void {
    this.idEditando.set(item.idTratamiento);
    this.formulario.setValue({ nombre: item.nombre, descripcion: item.descripcion ?? '' });
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
    const request = { nombre: valores.nombre ?? '', descripcion: valores.descripcion || null };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarTratamiento(id, request)
      : this.catalogosService.crearTratamiento(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: CatTratamiento): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarTratamiento(item.idTratamiento).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
