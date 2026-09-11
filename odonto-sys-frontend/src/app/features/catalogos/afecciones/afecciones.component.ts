import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { CatAfeccion } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-afecciones',
  imports: [ReactiveFormsModule],
  templateUrl: './afecciones.component.html'
})
export class AfeccionesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly items = signal<CatAfeccion[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nombreAfeccion: ['', Validators.required]
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.afecciones().subscribe({
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
    this.formulario.reset({ nombreAfeccion: '' });
    this.mostrarFormulario.set(true);
  }

  editar(item: CatAfeccion): void {
    this.idEditando.set(item.idAfeccion);
    this.formulario.setValue({ nombreAfeccion: item.nombreAfeccion });
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
    const request = { nombreAfeccion: valores.nombreAfeccion ?? '' };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarAfeccion(id, request)
      : this.catalogosService.crearAfeccion(request);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(id ? 'Registro actualizado.' : 'Registro creado.');
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: CatAfeccion): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarAfeccion(item.idAfeccion).subscribe({
      next: () => {
        this.notificacionService.exito('Registro eliminado.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
