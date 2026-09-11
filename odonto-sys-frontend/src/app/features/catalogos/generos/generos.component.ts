import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { CatGenero } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-generos',
  imports: [ReactiveFormsModule],
  templateUrl: './generos.component.html'
})
export class GenerosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly items = signal<CatGenero[]>([]);
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
    this.catalogosService.generos().subscribe({
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

  editar(item: CatGenero): void {
    this.idEditando.set(item.idGenero);
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
    const operacion = id ? this.catalogosService.actualizarGenero(id, request) : this.catalogosService.crearGenero(request);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(id ? 'Registro actualizado.' : 'Registro creado.');
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: CatGenero): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarGenero(item.idGenero).subscribe({
      next: () => {
        this.notificacionService.exito('Registro eliminado.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
