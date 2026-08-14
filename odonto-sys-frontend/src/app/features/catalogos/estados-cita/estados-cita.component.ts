import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { CatEstadoCita } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-estados-cita',
  imports: [ReactiveFormsModule],
  templateUrl: './estados-cita.component.html'
})
export class EstadosCitaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly items = signal<CatEstadoCita[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required]
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.estadosCita().subscribe({
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
    this.formulario.reset({ nombre: '' });
    this.mostrarFormulario.set(true);
  }

  editar(item: CatEstadoCita): void {
    this.idEditando.set(item.idEstadoCita);
    this.formulario.setValue({ nombre: item.nombre });
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

    const request = { nombre: this.formulario.getRawValue().nombre ?? '' };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarEstadoCita(id, request)
      : this.catalogosService.crearEstadoCita(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: CatEstadoCita): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarEstadoCita(item.idEstadoCita).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
