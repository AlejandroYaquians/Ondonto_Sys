import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PagoDetalleService } from '../../../../../core/services/pago-detalle.service';
import { ConsultaService } from '../../../../../core/services/consulta.service';
import { ConsultaTratamientoService } from '../../../../../core/services/consulta-tratamiento.service';
import { CatalogosService } from '../../../../../core/services/catalogos.service';
import { PagoDetalle } from '../../../../../core/models/pago.models';
import { CatMetodoPago, CatTratamiento, Servicio } from '../../../../../core/models/catalogo.models';

interface OpcionTratamiento {
  valor: number;
  etiqueta: string;
}

@Component({
  selector: 'app-detalles-pago-seccion',
  imports: [ReactiveFormsModule],
  templateUrl: './detalles-pago-seccion.component.html'
})
export class DetallesPagoSeccionComponent implements OnInit {
  @Input({ required: true }) idPago!: number;
  @Input({ required: true }) idPaciente!: number;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(PagoDetalleService);
  private readonly consultaService = inject(ConsultaService);
  private readonly consultaTratamientoService = inject(ConsultaTratamientoService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly items = signal<PagoDetalle[]>([]);
  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly metodosPago = signal<CatMetodoPago[]>([]);
  protected readonly tratamientosCatalogo = signal<CatTratamiento[]>([]);
  protected readonly opcionesTratamiento = signal<OpcionTratamiento[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    idServicio: [null as number | null, Validators.required],
    idMetodoPago: [null as number | null, Validators.required],
    idConsultaTratamiento: [null as number | null, Validators.required],
    precioAplicado: [null as number | null, Validators.required],
    costoLaboratorio: [null as number | null]
  });

  ngOnInit(): void {
    this.catalogosService.servicios().subscribe((datos) => this.servicios.set(datos));
    this.catalogosService.metodosPago().subscribe((datos) => this.metodosPago.set(datos));
    this.catalogosService.tratamientos().subscribe((datos) => this.tratamientosCatalogo.set(datos));
    this.cargarOpcionesTratamiento();
    this.cargar();
  }

  private cargarOpcionesTratamiento(): void {
    this.consultaService.listarPorPaciente(this.idPaciente).subscribe((consultas) => {
      if (consultas.length === 0) {
        return;
      }
      forkJoin(consultas.map((c) => this.consultaTratamientoService.listarPorConsulta(c.idConsulta))).subscribe(
        (listas) => {
          const combinados = listas.flat();
          this.opcionesTratamiento.set(
            combinados.map((ct) => ({
              valor: ct.idConsultaTratamiento,
              etiqueta: `${this.nombreTratamientoCatalogo(ct.idTratamiento)}${ct.fechaInicio ? ' · ' + ct.fechaInicio : ''}`
            }))
          );
        }
      );
    });
  }

  private nombreTratamientoCatalogo(id: number): string {
    return this.tratamientosCatalogo().find((t) => t.idTratamiento === id)?.nombre ?? `#${id}`;
  }

  private cargar(): void {
    this.cargando.set(true);
    this.service.listarPorPago(this.idPago).subscribe({
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

  nombreMetodoPago(id: number): string {
    return this.metodosPago().find((m) => m.idMetodoPago === id)?.nombre ?? `#${id}`;
  }

  etiquetaTratamiento(id: number): string {
    return this.opcionesTratamiento().find((o) => o.valor === id)?.etiqueta ?? `#${id}`;
  }

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({
      idServicio: null,
      idMetodoPago: null,
      idConsultaTratamiento: null,
      precioAplicado: null,
      costoLaboratorio: null
    });
    this.mostrarFormulario.set(true);
  }

  editar(item: PagoDetalle): void {
    this.idEditando.set(item.idDetallePago);
    this.formulario.setValue({
      idServicio: item.idServicio,
      idMetodoPago: item.idMetodoPago,
      idConsultaTratamiento: item.idConsultaTratamiento,
      precioAplicado: item.precioAplicado,
      costoLaboratorio: item.costoLaboratorio
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
      precioAplicado: valores.precioAplicado as number,
      costoLaboratorio: valores.costoLaboratorio,
      idPago: this.idPago,
      idServicio: valores.idServicio as number,
      idMetodoPago: valores.idMetodoPago as number,
      idConsultaTratamiento: valores.idConsultaTratamiento as number
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

  eliminar(item: PagoDetalle): void {
    if (!window.confirm('¿Desea eliminar este detalle?')) {
      return;
    }
    this.service.eliminar(item.idDetallePago).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
