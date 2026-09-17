import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { AccesoService } from '../../../core/services/acceso.service';
import { CatMotivoCita } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-motivos-cita',
  imports: [ReactiveFormsModule],
  templateUrl: './motivos-cita.component.html'
})
export class MotivosCitaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly accesoService = inject(AccesoService);

  protected readonly items = signal<CatMotivoCita[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly puedeCrear = computed(() => this.accesoService.puedeCrear('/catalogos/motivos-cita'));
  protected readonly puedeEditar = computed(() => this.accesoService.puedeEditar('/catalogos/motivos-cita'));
  protected readonly puedeEliminar = computed(() => this.accesoService.puedeEliminar('/catalogos/motivos-cita'));

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required]
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.motivosCita().subscribe({
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
    this.formulario.reset({ nombre: '' });
    this.mostrarFormulario.set(true);
  }

  editar(item: CatMotivoCita): void {
    this.idEditando.set(item.idMotivoCita);
    this.formulario.setValue({ nombre: item.nombre });
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

    const request = { nombre: this.formulario.getRawValue().nombre ?? '' };
    const id = this.idEditando();
    const operacion = id
      ? this.catalogosService.actualizarMotivoCita(id, request)
      : this.catalogosService.crearMotivoCita(request);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(id ? 'Registro actualizado.' : 'Registro creado.');
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: CatMotivoCita): void {
    if (!window.confirm('¿Desea eliminar este registro?')) {
      return;
    }
    this.catalogosService.eliminarMotivoCita(item.idMotivoCita).subscribe({
      next: () => {
        this.notificacionService.exito('Registro eliminado.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
