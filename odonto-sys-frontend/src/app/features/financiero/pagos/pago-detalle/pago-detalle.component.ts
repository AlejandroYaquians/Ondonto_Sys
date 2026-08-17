import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PagoService } from '../../../../core/services/pago.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { Pago } from '../../../../core/models/pago.models';
import { Paciente } from '../../../../core/models/paciente.models';
import { CatMetodoPago } from '../../../../core/models/catalogo.models';
import { DetallesPagoSeccionComponent } from './secciones/detalles-pago-seccion.component';
import { ComisionesSeccionComponent } from './secciones/comisiones-seccion.component';

@Component({
  selector: 'app-pago-detalle',
  imports: [RouterLink, DetallesPagoSeccionComponent, ComisionesSeccionComponent],
  templateUrl: './pago-detalle.component.html'
})
export class PagoDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pagoService = inject(PagoService);
  private readonly pacienteService = inject(PacienteService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly pago = signal<Pago | null>(null);
  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly metodosPago = signal<CatMetodoPago[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.catalogosService.metodosPago().subscribe((datos) => this.metodosPago.set(datos));

    this.pagoService.buscarPorId(id).subscribe({
      next: (pago) => {
        this.pago.set(pago);
        this.pacienteService.buscarPorId(pago.idPaciente).subscribe((datos) => this.paciente.set(datos));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreMetodoPago(id: number): string {
    return this.metodosPago().find((m) => m.idMetodoPago === id)?.nombre ?? `#${id}`;
  }

  formatoFecha(fecha: string): string {
    return fecha.slice(0, 16).replace('T', ' ');
  }

  cambiarEstado(estado: string): void {
    const pago = this.pago();
    if (!pago) {
      return;
    }
    this.pagoService.cambiarEstado(pago.idPago, estado).subscribe({
      next: (actualizado) => this.pago.set(actualizado),
      error: () => this.error.set('Error al guardar.')
    });
  }
}
