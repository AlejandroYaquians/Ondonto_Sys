import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { HistorialMedicoService } from '../../../core/services/historial-medico.service';
import { Paciente } from '../../../core/models/paciente.models';
import { CatAfeccion, CatGenero, CatProfesion, Municipio } from '../../../core/models/catalogo.models';
import { HistorialMedico } from '../../../core/models/historial-medico.models';
import { ContactosSeccionComponent } from './secciones/contactos-seccion.component';

@Component({
  selector: 'app-paciente-detalle',
  imports: [RouterLink, ContactosSeccionComponent],
  templateUrl: './paciente-detalle.component.html'
})
export class PacienteDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pacienteService = inject(PacienteService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly historialMedicoService = inject(HistorialMedicoService);

  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly generos = signal<CatGenero[]>([]);
  protected readonly profesiones = signal<CatProfesion[]>([]);
  protected readonly municipios = signal<Municipio[]>([]);
  protected readonly afeccionesCatalogo = signal<CatAfeccion[]>([]);
  protected readonly historial = signal<HistorialMedico[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.catalogosService.generos().subscribe((datos) => this.generos.set(datos));
    this.catalogosService.profesiones().subscribe((datos) => this.profesiones.set(datos));
    this.catalogosService.municipios().subscribe((datos) => this.municipios.set(datos));
    this.catalogosService.afecciones().subscribe((datos) => this.afeccionesCatalogo.set(datos));
    this.historialMedicoService.listarPorPaciente(id).subscribe((datos) => this.historial.set(datos));

    this.pacienteService.buscarPorId(id).subscribe({
      next: (paciente) => {
        this.paciente.set(paciente);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreGenero(id: number | null): string {
    if (!id) {
      return '—';
    }
    return this.generos().find((g) => g.idGenero === id)?.nombre ?? '—';
  }

  nombreProfesion(id: number | null): string {
    if (!id) {
      return '—';
    }
    return this.profesiones().find((p) => p.idProfesion === id)?.nombre ?? '—';
  }

  nombreMunicipio(id: number | null): string {
    if (!id) {
      return '—';
    }
    return this.municipios().find((m) => m.idMunicipio === id)?.nombre ?? '—';
  }

  nombreAfeccion(idAfeccion: number): string {
    return this.afeccionesCatalogo().find((a) => a.idAfeccion === idAfeccion)?.nombreAfeccion ?? `#${idAfeccion}`;
  }

  formatoFecha(fecha: string): string {
    return fecha ? fecha.slice(0, 16).replace('T', ' ') : '—';
  }
}
