import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { PacienteService } from '../../../core/services/paciente.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { ContactoPacienteService } from '../../../core/services/contacto-paciente.service';
import { AntecedenteMedicoService } from '../../../core/services/antecedente-medico.service';
import { PacienteRequest } from '../../../core/models/paciente.models';
import { CatGenero, CatProfesion, CatParentesco, CatAfeccion, Departamento, Municipio } from '../../../core/models/catalogo.models';
import { ContactoPaciente } from '../../../core/models/contacto-paciente.models';
import { AntecedenteMedico } from '../../../core/models/antecedente-medico.models';
import { BuscadorSelectComponent } from '../../../shared/buscador-select/buscador-select.component';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

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

@Component({
  selector: 'app-paciente-form',
  imports: [ReactiveFormsModule, RouterLink, BuscadorSelectComponent],
  templateUrl: './paciente-form.component.html'
})
export class PacienteFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pacienteService = inject(PacienteService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly contactoPacienteService = inject(ContactoPacienteService);
  private readonly antecedenteMedicoService = inject(AntecedenteMedicoService);
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
  protected readonly parentescos = signal<CatParentesco[]>([]);
  protected readonly afecciones = signal<CatAfeccion[]>([]);

  protected readonly antecedentesMarcados = signal<Set<number>>(new Set());
  protected readonly antecedentesDetalle = signal<Map<number, string>>(new Map());
  private historialExistente: AntecedenteMedico[] = [];

  private contactosEliminados: number[] = [];

  protected readonly opcionesProfesiones = computed(() =>
    this.profesiones().map((profesion) => ({ valor: profesion.idProfesion, etiqueta: profesion.nombre }))
  );

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    fechaNacimiento: [''],
    telefono: ['', Validators.required],
    email: ['', Validators.email],
    direccion: [''],
    referidoPor: [''],
    medicoFamilia: [''],
    idDepartamento: [null as number | null],
    idGenero: [null as number | null],
    idProfesion: [null as number | null],
    idMunicipio: [null as number | null],
    contactos: this.fb.array<ReturnType<typeof this.crearContactoGroup>>([])
  });

  protected readonly edad = signal<number | null>(null);

  get contactosFormArray() {
    return this.formulario.controls.contactos;
  }

  ngOnInit(): void {
    this.catalogosService.generos().subscribe((datos) => this.generos.set(datos));
    this.catalogosService.profesiones().subscribe((datos) => this.profesiones.set(datos));
    this.catalogosService.departamentos().subscribe((datos) => this.departamentos.set(datos));
    this.catalogosService.parentescos().subscribe((datos) => this.parentescos.set(datos));
    this.catalogosService.afecciones().subscribe((datos) => this.afecciones.set(datos));

    this.formulario.controls.idDepartamento.valueChanges.subscribe((idDepartamento) => {
      this.cargarMunicipios(idDepartamento ?? undefined);
    });

    this.formulario.controls.fechaNacimiento.valueChanges.subscribe((valor) => {
      this.edad.set(calcularEdad(valor ?? ''));
    });

    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idPaciente.set(id);
      this.cargarPaciente(id);
      this.contactoPacienteService.listarPorPaciente(id).subscribe((datos) => {
        datos.forEach((contacto) => this.contactosFormArray.push(this.crearContactoGroup(contacto)));
      });
      this.antecedenteMedicoService.listarPorPaciente(id).subscribe((datos) => {
        this.historialExistente = datos;
        this.antecedentesMarcados.set(new Set(datos.map((h) => h.idAfeccion)));
        const detalles = new Map<number, string>();
        datos.forEach((h) => detalles.set(h.idAfeccion, h.observacionDetalle ?? ''));
        this.antecedentesDetalle.set(detalles);
      });
    }
  }

  toggleAntecedente(idAfeccion: number): void {
    this.antecedentesMarcados.update((actuales) => {
      const nuevas = new Set(actuales);
      if (nuevas.has(idAfeccion)) {
        nuevas.delete(idAfeccion);
      } else {
        nuevas.add(idAfeccion);
      }
      return nuevas;
    });
  }

  cambiarDetalleAntecedente(idAfeccion: number, valor: string): void {
    this.antecedentesDetalle.update((actuales) => {
      const nuevas = new Map(actuales);
      nuevas.set(idAfeccion, valor);
      return nuevas;
    });
  }

  private crearContactoGroup(datos?: ContactoPaciente) {
    return this.fb.group({
      idContacto: [datos?.idContacto ?? (null as number | null)],
      nombreCompleto: [datos?.nombreCompleto ?? '', Validators.required],
      telefonoContacto: [datos?.telefonoContacto ?? ''],
      idParentesco: [datos?.idParentesco ?? (null as number | null)]
    });
  }

  agregarContacto(): void {
    this.contactosFormArray.push(this.crearContactoGroup());
  }

  quitarContacto(index: number): void {
    const idContacto = this.contactosFormArray.at(index).value.idContacto;
    if (idContacto) {
      this.contactosEliminados.push(idContacto);
    }
    this.contactosFormArray.removeAt(index);
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
      telefono: valores.telefono ?? '',
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
      next: (paciente) => this.guardarContactos(paciente.idPaciente),
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar.');
      }
    });
  }

  private guardarContactos(idPaciente: number): void {
    const operaciones: Observable<unknown>[] = [];

    for (const grupo of this.contactosFormArray.controls) {
      const valores = grupo.getRawValue();
      if (!valores.nombreCompleto) {
        continue;
      }
      const request = {
        nombreCompleto: valores.nombreCompleto,
        telefonoContacto: valores.telefonoContacto || null,
        idParentesco: valores.idParentesco,
        idPaciente
      };
      if (valores.idContacto) {
        operaciones.push(this.contactoPacienteService.actualizar(valores.idContacto, request));
      } else {
        operaciones.push(this.contactoPacienteService.crear(request));
      }
    }

    for (const idContacto of this.contactosEliminados) {
      operaciones.push(this.contactoPacienteService.eliminar(idContacto));
    }

    const marcados = this.antecedentesMarcados();
    const detalles = this.antecedentesDetalle();
    const existentesPorAfeccion = new Map(this.historialExistente.map((h) => [h.idAfeccion, h]));

    for (const idAfeccion of marcados) {
      const existente = existentesPorAfeccion.get(idAfeccion);
      const detalle = detalles.get(idAfeccion) || null;
      if (existente) {
        if (existente.observacionDetalle !== detalle) {
          operaciones.push(
            this.antecedenteMedicoService.actualizar(existente.idAntecedente, {
              idAfeccion,
              idPaciente,
              fechaRegistro: existente.fechaRegistro,
              observacionDetalle: detalle
            })
          );
        }
      } else {
        operaciones.push(
          this.antecedenteMedicoService.crear({
            idAfeccion,
            idPaciente,
            fechaRegistro: hoyIso(),
            observacionDetalle: detalle
          })
        );
      }
    }

    for (const item of this.historialExistente) {
      if (!marcados.has(item.idAfeccion)) {
        operaciones.push(this.antecedenteMedicoService.eliminar(item.idAntecedente));
      }
    }

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
