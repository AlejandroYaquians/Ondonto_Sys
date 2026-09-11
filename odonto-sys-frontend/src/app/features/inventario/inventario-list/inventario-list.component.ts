import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstrumentalService } from '../../../core/services/instrumental.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { Instrumental } from '../../../core/models/instrumental.models';

@Component({
  selector: 'app-inventario-list',
  imports: [RouterLink],
  templateUrl: './inventario-list.component.html'
})
export class InventarioListComponent implements OnInit {
  private readonly instrumentalService = inject(InstrumentalService);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly items = signal<Instrumental[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly esAdmin = computed(() => this.authService.rol() === 'ADMIN');
  protected readonly puedeGestionar = computed(() =>
    this.authService.rol() === 'ADMIN' || this.authService.rol() === 'RECEPCION'
  );

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
