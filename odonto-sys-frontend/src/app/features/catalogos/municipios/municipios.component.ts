import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { Departamento, Municipio } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-municipios',
  imports: [ReactiveFormsModule],
  templateUrl: './municipios.component.html'
})
export class MunicipiosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly items = signal<Municipio[]>([]);
  protected readonly departamentos = signal<Departamento[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    idDepartamento: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.catalogosService.departamentos().subscribe((datos) => this.departamentos.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.municipios().subscribe({
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

  nombreDepartamento(id: number): string {
    return this.departamentos().find((d) => d.idDepartamento === id)?.nombre ?? `#${id}`;
  }

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({ nombre: '', idDepartamento: null });
    this.mostrarFormulario.set(true);
  }

  editar(item: Municipio): void {
    this.idEditando.set(item.idMunicipio);
    this.formulario.setValue({ nombre: item.nombre, idDepartamento: item.idDepartamento });
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
    const request = { nombre: valores.nombre ?? '', idDepartamento: valores.idDepartamento as number };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarMunicipio(id, request)
      : this.catalogosService.crearMunicipio(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: Municipio): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarMunicipio(item.idMunicipio).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
