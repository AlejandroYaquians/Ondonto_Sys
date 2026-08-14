import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecetaService } from '../../../../core/services/receta.service';
import { Receta } from '../../../../core/models/consulta.models';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-recetas-seccion',
  imports: [ReactiveFormsModule],
  templateUrl: './recetas-seccion.component.html'
})
export class RecetasSeccionComponent implements OnInit {
  @Input({ required: true }) idConsulta!: number;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(RecetaService);

  protected readonly items = signal<Receta[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    medicamento: ['', Validators.required],
    dosis: [''],
    frecuencia: [''],
    duracion: [''],
    indicaciones: [''],
    fecha: [hoyIso(), Validators.required]
  });

  ngOnInit(): void {
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

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({
      medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      indicaciones: '',
      fecha: hoyIso()
    });
    this.mostrarFormulario.set(true);
  }

  editar(item: Receta): void {
    this.idEditando.set(item.idReceta);
    this.formulario.setValue({
      medicamento: item.medicamento,
      dosis: item.dosis ?? '',
      frecuencia: item.frecuencia ?? '',
      duracion: item.duracion ?? '',
      indicaciones: item.indicaciones ?? '',
      fecha: item.fecha
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
      medicamento: valores.medicamento ?? '',
      dosis: valores.dosis || null,
      frecuencia: valores.frecuencia || null,
      duracion: valores.duracion || null,
      indicaciones: valores.indicaciones || null,
      fecha: valores.fecha ?? '',
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

  eliminar(item: Receta): void {
    if (!window.confirm('¿Desea eliminar esta receta?')) {
      return;
    }
    this.service.eliminar(item.idReceta).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
