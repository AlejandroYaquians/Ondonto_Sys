import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactoPacienteService } from '../../../../core/services/contacto-paciente.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { ContactoPaciente } from '../../../../core/models/contacto-paciente.models';
import { CatParentesco } from '../../../../core/models/catalogo.models';

@Component({
  selector: 'app-contactos-seccion',
  imports: [ReactiveFormsModule],
  templateUrl: './contactos-seccion.component.html'
})
export class ContactosSeccionComponent implements OnInit {
  @Input({ required: true }) idPaciente!: number;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ContactoPacienteService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly items = signal<ContactoPaciente[]>([]);
  protected readonly parentescos = signal<CatParentesco[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nombreCompleto: ['', Validators.required],
    telefonoContacto: [''],
    idParentesco: [null as number | null]
  });

  ngOnInit(): void {
    this.catalogosService.parentescos().subscribe((datos) => this.parentescos.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.service.listarPorPaciente(this.idPaciente).subscribe({
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

  nombreParentesco(id: number | null): string {
    if (!id) {
      return '—';
    }
    return this.parentescos().find((p) => p.idParentesco === id)?.nombre ?? '—';
  }

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({ nombreCompleto: '', telefonoContacto: '', idParentesco: null });
    this.mostrarFormulario.set(true);
  }

  editar(item: ContactoPaciente): void {
    this.idEditando.set(item.idContacto);
    this.formulario.setValue({
      nombreCompleto: item.nombreCompleto,
      telefonoContacto: item.telefonoContacto ?? '',
      idParentesco: item.idParentesco
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
      nombreCompleto: valores.nombreCompleto ?? '',
      telefonoContacto: valores.telefonoContacto || null,
      idParentesco: valores.idParentesco,
      idPaciente: this.idPaciente
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

  eliminar(item: ContactoPaciente): void {
    if (!window.confirm('¿Desea eliminar este contacto?')) {
      return;
    }
    this.service.eliminar(item.idContacto).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
