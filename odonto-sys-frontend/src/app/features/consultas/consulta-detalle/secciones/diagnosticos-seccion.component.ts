import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultaDiagnosticoService } from '../../../../core/services/consulta-diagnostico.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { ConsultaDiagnostico } from '../../../../core/models/consulta.models';
import { CatDiagnostico } from '../../../../core/models/catalogo.models';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-diagnosticos-seccion',
  imports: [ReactiveFormsModule],
  templateUrl: './diagnosticos-seccion.component.html'
})
export class DiagnosticosSeccionComponent implements OnInit {
  @Input({ required: true }) idConsulta!: number;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ConsultaDiagnosticoService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly items = signal<ConsultaDiagnostico[]>([]);
  protected readonly catalogo = signal<CatDiagnostico[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    idDiagnostico: [null as number | null, Validators.required],
    fecha: [hoyIso(), Validators.required],
    descripcionDetalle: ['']
  });

  ngOnInit(): void {
    this.catalogosService.diagnosticos().subscribe((datos) => this.catalogo.set(datos));
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

  nombreDiagnostico(id: number): string {
    return this.catalogo().find((d) => d.idDiagnostico === id)?.nombre ?? `#${id}`;
  }

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({ idDiagnostico: null, fecha: hoyIso(), descripcionDetalle: '' });
    this.mostrarFormulario.set(true);
  }

  editar(item: ConsultaDiagnostico): void {
    this.idEditando.set(item.idConsultaDiagnostico);
    this.formulario.setValue({
      idDiagnostico: item.idDiagnostico,
      fecha: item.fecha,
      descripcionDetalle: item.descripcionDetalle ?? ''
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
      idDiagnostico: valores.idDiagnostico as number,
      fecha: valores.fecha ?? '',
      descripcionDetalle: valores.descripcionDetalle || null,
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

  eliminar(item: ConsultaDiagnostico): void {
    if (!window.confirm('¿Desea eliminar este diagnóstico?')) {
      return;
    }
    this.service.eliminar(item.idConsultaDiagnostico).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
