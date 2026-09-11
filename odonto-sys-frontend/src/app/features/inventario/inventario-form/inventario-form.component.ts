import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InstrumentalService } from '../../../core/services/instrumental.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { InstrumentalRequest } from '../../../core/models/instrumental.models';

@Component({
  selector: 'app-inventario-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inventario-form.component.html'
})
export class InventarioFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly instrumentalService = inject(InstrumentalService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly idInstrumental = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  private stockActualCargado: number | null = null;

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    stockActual: [0 as number | null],
    stockMinimo: [0 as number | null, Validators.required]
  });

  ngOnInit(): void {
    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idInstrumental.set(id);
      this.cargarInstrumental(id);
    }
  }

  private cargarInstrumental(id: number): void {
    this.cargando.set(true);
    this.instrumentalService.buscarPorId(id).subscribe({
      next: (item) => {
        this.stockActualCargado = item.stockActual;
        this.formulario.patchValue({
          nombre: item.nombre,
          descripcion: item.descripcion ?? '',
          stockMinimo: item.stockMinimo
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const id = this.idInstrumental();
    const request: InstrumentalRequest = {
      nombre: valores.nombre ?? '',
      descripcion: valores.descripcion || null,
      stockActual: id ? this.stockActualCargado : (valores.stockActual ?? 0),
      stockMinimo: valores.stockMinimo
    };

    const operacion = id
      ? this.instrumentalService.actualizar(id, request)
      : this.instrumentalService.crear(request);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(id ? 'Artículo actualizado.' : 'Artículo agregado.');
        this.router.navigateByUrl('/instrumental');
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar.');
      }
    });
  }
}
