import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InstrumentalService } from '../../../core/services/instrumental.service';
import { InstrumentalMovimientoService } from '../../../core/services/instrumental-movimiento.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Instrumental } from '../../../core/models/instrumental.models';
import { CatMovimiento } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-inventario-movimiento',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inventario-movimiento.component.html'
})
export class InventarioMovimientoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly instrumentalService = inject(InstrumentalService);
  private readonly movimientoService = inject(InstrumentalMovimientoService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly esEntrada = this.route.snapshot.data['esEntrada'] === true;

  protected readonly idInstrumental = signal(0);
  protected readonly instrumental = signal<Instrumental | null>(null);
  protected readonly tiposMovimiento = signal<CatMovimiento[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly tiposDisponibles = computed(() =>
    this.tiposMovimiento().filter((t) => t.operacion === this.esEntrada)
  );

  protected readonly formulario = this.fb.group({
    idTipoMovimiento: [null as number | null, Validators.required],
    cantidad: [null as number | null, [Validators.required, Validators.min(1)]],
    motivo: ['']
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.idInstrumental.set(id);

    this.catalogosService.tiposMovimiento().subscribe((datos) => this.tiposMovimiento.set(datos));
    this.instrumentalService.buscarPorId(id).subscribe({
      next: (item) => {
        this.instrumental.set(item);
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
    const request = {
      cantidad: valores.cantidad as number,
      motivo: valores.motivo || null,
      idInstrumental: this.idInstrumental(),
      idTipoMovimiento: valores.idTipoMovimiento as number
    };

    this.movimientoService.crear(request).subscribe({
      next: () => {
        this.notificacionService.exito(this.esEntrada ? 'Entrada registrada.' : 'Salida registrada.');
        this.router.navigateByUrl('/instrumental');
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje ?? 'Error al guardar.');
      }
    });
  }
}
