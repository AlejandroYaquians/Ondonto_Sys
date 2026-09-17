import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstrumentalService } from '../../../core/services/instrumental.service';
import { AccesoService } from '../../../core/services/acceso.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Instrumental } from '../../../core/models/instrumental.models';

@Component({
  selector: 'app-inventario-list',
  imports: [RouterLink],
  templateUrl: './inventario-list.component.html',
  styleUrl: './inventario-list.component.scss'
})
export class InventarioListComponent implements OnInit {
  private readonly instrumentalService = inject(InstrumentalService);
  private readonly accesoService = inject(AccesoService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly items = signal<Instrumental[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly puedeCrear = computed(() => this.accesoService.puedeCrear('/instrumental'));
  protected readonly puedeEditar = computed(() => this.accesoService.puedeEditar('/instrumental'));
  protected readonly puedeEliminar = computed(() => this.accesoService.puedeEliminar('/instrumental'));

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.instrumentalService.listarActivos().subscribe({
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

  tieneStockBajo(item: Instrumental): boolean {
    return item.stockActual !== null && item.stockMinimo !== null && item.stockActual < item.stockMinimo;
  }

  eliminar(item: Instrumental): void {
    if (!window.confirm(`¿Desea eliminar "${item.nombre}"?`)) {
      return;
    }
    this.instrumentalService.eliminar(item.idInstrumental).subscribe({
      next: () => {
        this.notificacionService.exito('Artículo eliminado.');
        this.cargar();
      },
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
