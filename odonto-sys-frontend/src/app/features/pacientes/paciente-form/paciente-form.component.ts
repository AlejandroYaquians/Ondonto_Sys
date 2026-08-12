import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { PacienteRequest } from '../../../core/models/paciente.models';
import { CatGenero, CatProfesion, Departamento, Municipio } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-paciente-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './paciente-form.component.html'
})
export class PacienteFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pacienteService = inject(PacienteService);
  private readonly catalogosService = inject(CatalogosService);
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

    this.formulario.controls.idDepartamento.valueChanges.subscribe((idDepartamento) => {
      this.cargarMunicipios(idDepartamento ?? undefined);
    });

    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idPaciente.set(id);
      this.cargarPaciente(id);
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
        this.error.set('No se pudo cargar la información del paciente.');
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
      next: () => this.router.navigateByUrl('/pacientes'),
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar el paciente. Verifique los datos.');
      }
    });
  }
}
