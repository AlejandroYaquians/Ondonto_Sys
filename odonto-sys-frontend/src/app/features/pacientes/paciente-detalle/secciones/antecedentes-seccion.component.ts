import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { AntecedenteMedicoService } from '../../../../core/services/antecedente-medico.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { AntecedenteMedico } from '../../../../core/models/antecedente-medico.models';
import { CatAfeccion } from '../../../../core/models/catalogo.models';

@Component({
  selector: 'app-antecedentes-seccion',
  imports: [],
  templateUrl: './antecedentes-seccion.component.html'
})
export class AntecedentesSeccionComponent implements OnInit {
  @Input({ required: true }) idPaciente!: number;

  private readonly antecedenteMedicoService = inject(AntecedenteMedicoService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly afecciones = signal<CatAfeccion[]>([]);
  protected readonly antecedentes = signal<AntecedenteMedico[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.catalogosService.afecciones().subscribe((datos) => this.afecciones.set(datos));

    this.cargando.set(true);
    this.antecedenteMedicoService.listarPorPaciente(this.idPaciente).subscribe({
      next: (datos) => {
        this.antecedentes.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreAfeccion(idAfeccion: number): string {
    return this.afecciones().find((a) => a.idAfeccion === idAfeccion)?.nombreAfeccion ?? `#${idAfeccion}`;
  }
}
