import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { PacienteService } from '../../../core/services/paciente.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { HistorialMedicoService } from '../../../core/services/historial-medico.service';
import { PacienteRequest } from '../../../core/models/paciente.models';
import { CatAfeccion, CatGenero, CatProfesion, Departamento, Municipio } from '../../../core/models/catalogo.models';
import { HistorialMedico } from '../../../core/models/historial-medico.models';
import { BuscadorSelectComponent } from '../../../shared/buscador-select/buscador-select.component';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-paciente-form',
  imports: [ReactiveFormsModule, RouterLink, BuscadorSelectComponent],
  templateUrl: './paciente-form.component.html'
})
export class PacienteFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pacienteService = inject(PacienteService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly historialMedicoService = inject(HistorialMedicoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly idPaciente = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly generos = signal<CatGenero[]>([]);
  protected readonly profesiones = signal<CatProfesion[]>([]);
  protected readonly departamentos = signal<Departamento[]>([]);
  protected readonly municipios = signal<Municipio[]>([]);

  protected readonly afecciones = signal<CatAfeccion[]>([]);
  protected readonly afeccionesMarcadas = signal<Set<number>>(new Set());
  private historialExistente: HistorialMedico[] = [];

  protected readonly opcionesProfesiones = computed(() =>
    this.profesiones().map((profesion) => ({ valor: profesion.idProfesion, etiqueta: profesion.nombre }))
  );

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    fechaNacimiento: [''],
    telefono: [''],
    celular: [''],
    email: ['', Validators.email],
    direccion: [''],
    referidoPor: [''],
    medicoFamilia: [''],
    idDepartamento: [null as number | null],
    idGenero: [null as number | null],
    idProfesion: [null as number | null],
    idMunicipio: [null as number | null]
  });

  ngOnInit(): void {
    this.catalogosService.generos().subscribe((datos) => this.generos.set(datos));
    this.catalogosService.profesiones().subscribe((datos) => this.profesiones.set(datos));
    this.catalogosService.departamentos().subscribe((datos) => this.departamentos.set(datos));
    this.catalogosService.afecciones().subscribe((datos) => this.afecciones.set(datos));

    this.formulario.controls.idDepartamento.valueChanges.subscribe((idDepartamento) => {
      this.cargarMunicipios(idDepartamento ?? undefined);
    });

    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idPaciente.set(id);
      this.cargarPaciente(id);
      this.historialMedicoService.listarPorPaciente(id).subscribe((datos) => {
        this.historialExistente = datos;
        this.afeccionesMarcadas.set(new Set(datos.map((h) => h.idAfeccion)));
      });
    }
  }

  private cargarPaciente(id: number): void {
    this.cargando.set(true);
    this.pacienteService.buscarPorId(id).subscribe({
      next: (paciente) => {
        this.formulario.patchValue({
          nombre: paciente.nombre,
          apellido: paciente.apellido,
          fechaNacimiento: paciente.fechaNacimiento ?? '',
          telefono: paciente.telefono ?? '',
          celular: paciente.celular ?? '',
          email: paciente.email ?? '',
          direccion: paciente.direccion ?? '',
          referidoPor: paciente.referidoPor ?? '',
          medicoFamilia: paciente.medicoFamilia ?? '',
          idGenero: paciente.idGenero,
          idProfesion: paciente.idProfesion,
          idMunicipio: paciente.idMunicipio
        });

        if (paciente.idMunicipio) {
          this.catalogosService.municipios().subscribe((todos) => {
            const municipio = todos.find((m) => m.idMunicipio === paciente.idMunicipio);
            if (municipio) {
              this.formulario.controls.idDepartamento.setValue(municipio.idDepartamento, { emitEvent: false });
              this.cargarMunicipios(municipio.idDepartamento);
            }
          });
        }

        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  private cargarMunicipios(idDepartamento?: number): void {
    if (!idDepartamento) {
      this.municipios.set([]);
      return;
    }
    this.catalogosService.municipios(idDepartamento).subscribe((datos) => this.municipios.set(datos));
  }

  estaMarcada(idAfeccion: number): boolean {
    return this.afeccionesMarcadas().has(idAfeccion);
  }

  toggleAfeccion(idAfeccion: number): void {
    this.afeccionesMarcadas.update((actuales) => {
      const nuevas = new Set(actuales);
      if (nuevas.has(idAfeccion)) {
        nuevas.delete(idAfeccion);
      } else {
        nuevas.add(idAfeccion);
      }
      return nuevas;
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const request: PacienteRequest = {
      nombre: valores.nombre ?? '',
      apellido: valores.apellido ?? '',
      fechaNacimiento: valores.fechaNacimiento || null,
      telefono: valores.telefono || null,
      celular: valores.celular || null,
      email: valores.email || null,
      direccion: valores.direccion || null,
      referidoPor: valores.referidoPor || null,
      medicoFamilia: valores.medicoFamilia || null,
      idGenero: valores.idGenero,
      idProfesion: valores.idProfesion,
      idMunicipio: valores.idMunicipio
    };

    const id = this.idPaciente();
    const operacion = id ? this.pacienteService.actualizar(id, request) : this.pacienteService.crear(request);

    operacion.subscribe({
      next: (paciente) => this.guardarAfecciones(paciente.idPaciente),
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar.');
      }
    });
  }

  private guardarAfecciones(idPaciente: number): void {
    const marcadas = this.afeccionesMarcadas();
    const idsExistentes = new Set(this.historialExistente.map((h) => h.idAfeccion));

    const aCrear = [...marcadas].filter((idAfeccion) => !idsExistentes.has(idAfeccion));
    const aEliminar = this.historialExistente.filter((h) => !marcadas.has(h.idAfeccion));

    const operaciones: Observable<unknown>[] = [
      ...aCrear.map((idAfeccion) =>
        this.historialMedicoService.crear({
          idAfeccion,
          idPaciente,
          fechaRegistro: hoyIso(),
          observacionDetalle: null
        })
      ),
      ...aEliminar.map((h) => this.historialMedicoService.eliminar(h.idHistorial))
    ];

    if (operaciones.length === 0) {
      this.router.navigateByUrl('/pacientes');
      return;
    }

    forkJoin(operaciones).subscribe({
      next: () => this.router.navigateByUrl('/pacientes'),
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar.');
      }
    });
  }
}
