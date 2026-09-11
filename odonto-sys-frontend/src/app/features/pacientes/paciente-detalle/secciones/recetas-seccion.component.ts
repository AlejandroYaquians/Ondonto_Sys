import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { RecetaService } from '../../../../core/services/receta.service';
import { Receta } from '../../../../core/models/receta.models';

@Component({
  selector: 'app-recetas-seccion',
  imports: [],
  templateUrl: './recetas-seccion.component.html'
})
export class RecetasSeccionComponent implements OnInit {
  @Input({ required: true }) idPaciente!: number;

  private readonly recetaService = inject(RecetaService);

  protected readonly recetas = signal<Receta[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargando.set(true);
    this.recetaService.listarPorPaciente(this.idPaciente).subscribe({
      next: (datos) => {
        this.recetas.set(datos.sort((a, b) => b.fecha.localeCompare(a.fecha)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  fechaDiaMesAnio(fechaIso: string): string {
    const [anio, mes, dia] = fechaIso.split('-');
    return `${dia}-${mes}-${anio}`;
  }
}
