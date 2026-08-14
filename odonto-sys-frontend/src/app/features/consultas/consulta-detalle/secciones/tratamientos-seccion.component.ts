import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultaTratamientoService } from '../../../../core/services/consulta-tratamiento.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { ConsultaTratamiento } from '../../../../core/models/consulta.models';
import { CatTratamiento, Servicio } from '../../../../core/models/catalogo.models';

const ESTADOS = ['Pendiente', 'En proceso', 'Completado', 'Cancelado'];

@Component({
  selector: 'app-tratamientos-seccion',
  imports: [ReactiveFormsModule],
  templateUrl: './tratamientos-seccion.component.html'
})
export class TratamientosSeccionComponent implements OnInit {
  @Input({ required: true }) idConsulta!: number;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ConsultaTratamientoService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly estados = ESTADOS;
  protected readonly items = signal<ConsultaTratamiento[]>([]);
  protected readonly catalogo = signal<CatTratamiento[]>([]);
  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    idTratamiento: [null as number | null, Validators.required],
    idServicio: [null as number | null],
    descripcion: [''],
    fechaInicio: [''],
    fechaFin: [''],
    estado: ['Pendiente']
  });

  ngOnInit(): void {
    this.catalogosService.tratamientos().subscribe((datos) => this.catalogo.set(datos));
    this.catalogosService.servicios().subscribe((datos) => this.servicios.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.service.listarPorConsulta(this.idConsulta).subscribe({
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

  nombreTratamiento(id: number): string {
    return this.catalogo().find((t) => t.idTratamiento === id)?.nombre ?? `#${id}`;
  }

  nombreServicio(id: number | null): string {
    if (!id) {
      return '—';
    }
    return this.servicios().find((s) => s.idServicio === id)?.nombre ?? `#${id}`;
  }

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({
      idTratamiento: null,
      idServicio: null,
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      estado: 'Pendiente'
    });
    this.mostrarFormulario.set(true);
  }

  editar(item: ConsultaTratamiento): void {
    this.idEditando.set(item.idConsultaTratamiento);
    this.formulario.setValue({
      idTratamiento: item.idTratamiento,
      idServicio: item.idServicio,
      descripcion: item.descripcion ?? '',
      fechaInicio: item.fechaInicio ?? '',
      fechaFin: item.fechaFin ?? '',
      estado: item.estado ?? 'Pendiente'
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
      idTratamiento: valores.idTratamiento as number,
      idServicio: valores.idServicio,
      descripcion: valores.descripcion || null,
      fechaInicio: valores.fechaInicio || null,
      fechaFin: valores.fechaFin || null,
      estado: valores.estado || null,
      idConsulta: this.idConsulta
    };

    const id = this.idEditando();
    const operacion = id ? this.service.actualizar(id, request) : this.service.crear(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: ConsultaTratamiento): void {
    if (!window.confirm('¿Desea eliminar este tratamiento?')) {
      return;
    }
    this.service.eliminar(item.idConsultaTratamiento).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
