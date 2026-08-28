import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { AntecedenteMedicoService } from '../../../../core/services/antecedente-medico.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AntecedenteMedico } from '../../../../core/models/antecedente-medico.models';
import { CatAfeccion } from '../../../../core/models/catalogo.models';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-antecedentes-seccion',
  imports: [],
  templateUrl: './antecedentes-seccion.component.html'
})
export class AntecedentesSeccionComponent implements OnInit {
  @Input({ required: true }) idPaciente!: number;

  private readonly antecedenteMedicoService = inject(AntecedenteMedicoService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly authService = inject(AuthService);

  protected readonly esDoctor = computed(() => this.authService.rol() === 'DOCTOR');

  protected readonly afecciones = signal<CatAfeccion[]>([]);
  protected readonly antecedentes = signal<AntecedenteMedico[]>([]);
  protected readonly marcadas = signal<Set<number>>(new Set());
  protected readonly detalles = signal<Map<number, string>>(new Map());
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.catalogosService.afecciones().subscribe((datos) => this.afecciones.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.antecedenteMedicoService.listarPorPaciente(this.idPaciente).subscribe({
      next: (datos) => {
        this.antecedentes.set(datos);
        this.marcadas.set(new Set(datos.map((h) => h.idAfeccion)));
        const detalles = new Map<number, string>();
        datos.forEach((h) => detalles.set(h.idAfeccion, h.observacionDetalle ?? ''));
        this.detalles.set(detalles);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  estaMarcada(idAfeccion: number): boolean {
    return this.marcadas().has(idAfeccion);
  }

  detalleDe(idAfeccion: number): string {
    return this.detalles().get(idAfeccion) ?? '';
  }

  toggleAfeccion(idAfeccion: number): void {
    this.marcadas.update((actuales) => {
      const nuevas = new Set(actuales);
      if (nuevas.has(idAfeccion)) {
        nuevas.delete(idAfeccion);
      } else {
        nuevas.add(idAfeccion);
      }
      return nuevas;
    });
  }

  cambiarDetalle(idAfeccion: number, valor: string): void {
    this.detalles.update((actuales) => {
      const nuevas = new Map(actuales);
      nuevas.set(idAfeccion, valor);
      return nuevas;
    });
  }

  guardar(): void {
    this.guardando.set(true);
    this.error.set(null);

    const marcadas = this.marcadas();
    const detalles = this.detalles();
    const existentesPorAfeccion = new Map(this.antecedentes().map((h) => [h.idAfeccion, h]));

    const operaciones: Observable<unknown>[] = [];

    for (const idAfeccion of marcadas) {
      const existente = existentesPorAfeccion.get(idAfeccion);
      const detalle = detalles.get(idAfeccion) || null;
      if (existente) {
        if (existente.observacionDetalle !== detalle) {
          operaciones.push(
            this.antecedenteMedicoService.actualizar(existente.idAntecedente, {
              idAfeccion,
              idPaciente: this.idPaciente,
              fechaRegistro: existente.fechaRegistro,
              observacionDetalle: detalle
            })
          );
        }
      } else {
        operaciones.push(
          this.antecedenteMedicoService.crear({
            idAfeccion,
            idPaciente: this.idPaciente,
            fechaRegistro: hoyIso(),
            observacionDetalle: detalle
          })
        );
      }
    }

    for (const item of this.antecedentes()) {
      if (!marcadas.has(item.idAfeccion)) {
        operaciones.push(this.antecedenteMedicoService.eliminar(item.idAntecedente));
      }
    }

    if (operaciones.length === 0) {
      this.guardando.set(false);
      return;
    }

    forkJoin(operaciones).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cargar();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar.');
      }
    });
  }
}
