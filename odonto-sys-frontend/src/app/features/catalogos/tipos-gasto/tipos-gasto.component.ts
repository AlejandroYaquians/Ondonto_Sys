import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { AccesoService } from '../../../core/services/acceso.service';
import { CatGasto } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-tipos-gasto',
  imports: [ReactiveFormsModule],
  templateUrl: './tipos-gasto.component.html'
})
export class TiposGastoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly accesoService = inject(AccesoService);

  protected readonly items = signal<CatGasto[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly puedeCrear = computed(() => this.accesoService.puedeCrear('/catalogos/tipos-gasto'));
  protected readonly puedeEditar = computed(() => this.accesoService.puedeEditar('/catalogos/tipos-gasto'));
  protected readonly puedeEliminar = computed(() => this.accesoService.puedeEliminar('/catalogos/tipos-gasto'));

  protected readonly formulario = this.fb.group({
    nombreCategoria: ['', Validators.required],
    tipo: ['', Validators.required]
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.tiposGasto().subscribe({
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
    this.formulario.reset({ nombreCategoria: '', tipo: '' });
    this.mostrarFormulario.set(true);
  }

  editar(item: CatGasto): void {
    this.idEditando.set(item.idTipoGasto);
    this.formulario.setValue({ nombreCategoria: item.nombreCategoria, tipo: item.tipo ?? '' });
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
    const request = { nombreCategoria: valores.nombreCategoria ?? '', tipo: valores.tipo || null };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarTipoGasto(id, request)
      : this.catalogosService.crearTipoGasto(request);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(id ? 'Registro actualizado.' : 'Registro creado.');
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: CatGasto): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarTipoGasto(item.idTipoGasto).subscribe({
      next: () => {
        this.notificacionService.exito('Registro eliminado.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
