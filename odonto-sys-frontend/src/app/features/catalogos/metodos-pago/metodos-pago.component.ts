import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { CatMetodoPago } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-metodos-pago',
  imports: [FormsModule],
  templateUrl: './metodos-pago.component.html'
})
export class MetodosPagoComponent implements OnInit {
  private readonly catalogosService = inject(CatalogosService);
  private readonly notificacionService = inject(NotificacionService);

  protected readonly items = signal<CatMetodoPago[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly idEditando = signal<number | null>(null);
  protected readonly comisionEditando = signal<number | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.catalogosService.metodosPago().subscribe({
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

  editar(item: CatMetodoPago): void {
    this.idEditando.set(item.idMetodoPago);
    this.comisionEditando.set(item.comisionPorcentaje);
  }

  cancelar(): void {
    this.idEditando.set(null);
    this.comisionEditando.set(null);
  }

  guardar(item: CatMetodoPago): void {
    const request = { nombre: item.nombre, comisionPorcentaje: this.comisionEditando() };
    this.catalogosService.actualizarMetodoPago(item.idMetodoPago, request).subscribe({
      next: () => {
        this.notificacionService.exito('Registro actualizado.');
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }
}
