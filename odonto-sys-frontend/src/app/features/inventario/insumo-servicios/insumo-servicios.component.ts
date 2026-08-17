import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsumoService } from '../../../core/services/insumo.service';
import { InsumoServicioService } from '../../../core/services/insumo-servicio.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { Insumo, InsumoServicio } from '../../../core/models/insumo.models';
import { Servicio } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-insumo-servicios',
  imports: [ReactiveFormsModule],
  templateUrl: './insumo-servicios.component.html'
})
export class InsumoServiciosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly insumoService = inject(InsumoService);
  private readonly insumoServicioService = inject(InsumoServicioService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly insumos = signal<Insumo[]>([]);
  protected readonly items = signal<InsumoServicio[]>([]);
  protected readonly idServicioSeleccionado = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    idInsumo: [null as number | null, Validators.required],
    cantidadEstimada: [null as number | null]
  });

  ngOnInit(): void {
    this.catalogosService.servicios().subscribe((datos) => this.servicios.set(datos));
  }

  private cargarInsumos(): void {
    this.insumoService.listar().subscribe((datos) => this.insumos.set(datos.filter((i) => i.activo)));
  }

  seleccionarServicio(idServicio: number | null): void {
    this.idServicioSeleccionado.set(idServicio);
    this.mostrarFormulario.set(false);
    if (idServicio) {
      this.cargarInsumos();
      this.cargar(idServicio);
    } else {
      this.items.set([]);
    }
  }

  private cargar(idServicio: number): void {
    this.cargando.set(true);
    this.insumoServicioService.listarPorServicio(idServicio).subscribe({
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

  nombreServicio(id: number): string {
    return this.servicios().find((s) => s.idServicio === id)?.nombre ?? `#${id}`;
  }

  nombreInsumo(id: number): string {
    return this.insumos().find((i) => i.idInsumo === id)?.nombre ?? `#${id}`;
  }

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({ idInsumo: null, cantidadEstimada: null });
    this.mostrarFormulario.set(true);
  }

  editar(item: InsumoServicio): void {
    this.idEditando.set(item.idInsumoServicio);
    this.formulario.setValue({ idInsumo: item.idInsumo, cantidadEstimada: item.cantidadEstimada });
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

    const idServicio = this.idServicioSeleccionado();
    if (!idServicio) {
      return;
    }

    const valores = this.formulario.getRawValue();
    const request = {
      idInsumo: valores.idInsumo as number,
      cantidadEstimada: valores.cantidadEstimada,
      idServicio
    };

    const id = this.idEditando();
    const operacion = id
      ? this.insumoServicioService.actualizar(id, request)
      : this.insumoServicioService.crear(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar(idServicio);
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: InsumoServicio): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.insumoServicioService.eliminar(item.idInsumoServicio).subscribe({
      next: () => this.cargar(item.idServicio),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
