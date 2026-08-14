import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { CatDiagnostico } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-diagnosticos',
  imports: [ReactiveFormsModule],
  templateUrl: './diagnosticos.component.html'
})
export class DiagnosticosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly items = signal<CatDiagnostico[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.diagnosticos().subscribe({
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
    this.formulario.reset({ nombre: '', descripcion: '' });
    this.mostrarFormulario.set(true);
  }

  editar(item: CatDiagnostico): void {
    this.idEditando.set(item.idDiagnostico);
    this.formulario.setValue({ nombre: item.nombre, descripcion: item.descripcion ?? '' });
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
    const request = { nombre: valores.nombre ?? '', descripcion: valores.descripcion || null };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarDiagnostico(id, request)
      : this.catalogosService.crearDiagnostico(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: CatDiagnostico): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarDiagnostico(item.idDiagnostico).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
