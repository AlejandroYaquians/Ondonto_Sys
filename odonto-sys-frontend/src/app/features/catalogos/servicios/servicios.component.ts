import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Servicio } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-servicios',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './servicios.component.html'
})
export class ServiciosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly items = signal<Servicio[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    costoBase: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.servicios().subscribe({
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
    this.formulario.reset({ nombre: '', descripcion: '', costoBase: null });
    this.mostrarFormulario.set(true);
  }

  editar(item: Servicio): void {
    this.idEditando.set(item.idServicio);
    this.formulario.setValue({
      nombre: item.nombre,
      descripcion: item.descripcion ?? '',
      costoBase: item.costoBase
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
      costoBase: valores.costoBase as number
    };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarServicio(id, request)
      : this.catalogosService.crearServicio(request);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(id ? 'Servicio actualizado.' : 'Servicio creado.');
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: Servicio): void {
    if (!window.confirm(`¿Desea eliminar el servicio "${item.nombre}"?`)) {
      return;
    }
    this.catalogosService.eliminarServicio(item.idServicio).subscribe({
      next: () => {
        this.notificacionService.exito('Servicio eliminado.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
