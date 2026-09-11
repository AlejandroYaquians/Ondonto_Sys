import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CobroService } from '../../../../core/services/cobro.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { Cobro } from '../../../../core/models/cobro.models';
import { CatMetodoPago, Servicio } from '../../../../core/models/catalogo.models';

@Component({
  selector: 'app-cobros-seccion',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cobros-seccion.component.html'
})
export class CobrosSeccionComponent implements OnInit {
  @Input({ required: true }) idPaciente!: number;

  private readonly cobroService = inject(CobroService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly cobros = signal<Cobro[]>([]);
  protected readonly metodosPago = signal<CatMetodoPago[]>([]);
  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.catalogosService.metodosPago().subscribe((datos) => this.metodosPago.set(datos));
    this.catalogosService.servicios().subscribe((datos) => this.servicios.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.cobroService.listarPorPaciente(this.idPaciente).subscribe({
      next: (cobros) => {
        this.cobros.set(cobros.sort((a, b) => b.fecha.localeCompare(a.fecha)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreServicio(idServicio: number | null): string {
    if (!idServicio) {
      return '-';
    }
    return this.servicios().find((s) => s.idServicio === idServicio)?.nombre ?? `#${idServicio}`;
  }

  nombreMetodoPago(idMetodoPago: number): string {
    return this.metodosPago().find((m) => m.idMetodoPago === idMetodoPago)?.nombre ?? `#${idMetodoPago}`;
  }

  formatoFecha(fecha: string): string {
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }
}
