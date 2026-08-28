import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AuthService } from '../../../core/services/auth.service';
import { Paciente } from '../../../core/models/paciente.models';
import { CatGenero, CatProfesion, Municipio } from '../../../core/models/catalogo.models';
import { ContactosSeccionComponent } from './secciones/contactos-seccion.component';
import { AntecedentesSeccionComponent } from './secciones/antecedentes-seccion.component';
import { CitasSeccionComponent } from './secciones/citas-seccion.component';
import { HistorialClinicoSeccionComponent } from './secciones/historial-clinico-seccion.component';
import { RecetasSeccionComponent } from './secciones/recetas-seccion.component';
import { CobrosSeccionComponent } from './secciones/cobros-seccion.component';

function calcularEdad(fechaNacimiento: string): number | null {
  if (!fechaNacimiento) {
    return null;
  }
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) {
    edad--;
  }
  return edad;
}

type PestanaExpediente = 'datos' | 'antecedentes' | 'citas' | 'historialClinico' | 'recetas' | 'cobros';

@Component({
  selector: 'app-paciente-detalle',
  imports: [
    RouterLink,
    ContactosSeccionComponent,
    AntecedentesSeccionComponent,
    CitasSeccionComponent,
    HistorialClinicoSeccionComponent,
    RecetasSeccionComponent,
    CobrosSeccionComponent
  ],
  templateUrl: './paciente-detalle.component.html'
})
export class PacienteDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pacienteService = inject(PacienteService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly authService = inject(AuthService);

  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly generos = signal<CatGenero[]>([]);
  protected readonly profesiones = signal<CatProfesion[]>([]);
  protected readonly municipios = signal<Municipio[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly esDoctor = computed(() => this.authService.rol() === 'DOCTOR');
  protected readonly pestanaActiva = signal<PestanaExpediente>('datos');

  protected readonly edad = computed(() => {
    const p = this.paciente();
    return p?.fechaNacimiento ? calcularEdad(p.fechaNacimiento) : null;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.catalogosService.generos().subscribe((datos) => this.generos.set(datos));
    this.catalogosService.profesiones().subscribe((datos) => this.profesiones.set(datos));
    this.catalogosService.municipios().subscribe((datos) => this.municipios.set(datos));

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

  cambiarPestana(pestana: PestanaExpediente): void {
    this.pestanaActiva.set(pestana);
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

  formatoFecha(fecha: string): string {
    return fecha ? fecha.slice(0, 16).replace('T', ' ') : '—';
  }
}
