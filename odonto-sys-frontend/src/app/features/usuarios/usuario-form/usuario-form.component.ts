import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { RolService } from '../../../core/services/rol.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { UsuarioRequest } from '../../../core/models/usuario.models';
import { Rol } from '../../../core/models/rol.models';
import { CatEspecialidad } from '../../../core/models/catalogo.models';

const ROL_DOCTOR = 'DOCTOR';

@Component({
  selector: 'app-usuario-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './usuario-form.component.html'
})
export class UsuarioFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly idUsuario = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly roles = signal<Rol[]>([]);
  protected readonly especialidades = signal<CatEspecialidad[]>([]);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    idRol: [null as number | null, Validators.required],
    apellido: [''],
    porcentajeComision: [0],
    idsEspecialidad: [[] as number[]]
  });

  private readonly idRolSeleccionado = toSignal(this.formulario.controls.idRol.valueChanges, {
    initialValue: null as number | null
  });

  protected readonly esNuevo = computed(() => this.idUsuario() === null);

  protected readonly esRolDoctor = computed(() => {
    const rol = this.roles().find((r) => r.idRol === this.idRolSeleccionado());
    return rol?.nombre === ROL_DOCTOR;
  });

  protected readonly mostrarCamposDoctor = computed(() => this.esNuevo() && this.esRolDoctor());

  ngOnInit(): void {
    this.rolService.listar().subscribe((datos) => this.roles.set(datos));
    this.catalogosService.especialidades().subscribe((datos) => this.especialidades.set(datos));

    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idUsuario.set(id);
      this.cargarUsuario(id);
    }
  }

  private cargarUsuario(id: number): void {
    this.cargando.set(true);
    this.usuarioService.buscarPorId(id).subscribe({
      next: (usuario) => {
        this.formulario.patchValue({
          nombre: usuario.nombre,
          username: usuario.username,
          idRol: usuario.idRol
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  seleccionarEspecialidades(event: Event): void {
    const seleccionadas = Array.from((event.target as HTMLSelectElement).selectedOptions)
      .map((opcion) => Number(opcion.value));
    this.formulario.patchValue({ idsEspecialidad: seleccionadas });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const request: UsuarioRequest = {
      nombre: valores.nombre ?? '',
      username: valores.username ?? '',
      password: valores.password ?? '',
      idRol: valores.idRol as number,
      apellido: this.mostrarCamposDoctor() ? valores.apellido || null : null,
      porcentajeComision: this.mostrarCamposDoctor() ? valores.porcentajeComision : null,
      idsEspecialidad: this.mostrarCamposDoctor() ? valores.idsEspecialidad : null
    };

    const id = this.idUsuario();
    const operacion = id ? this.usuarioService.actualizar(id, request) : this.usuarioService.crear(request);

    operacion.subscribe({
      next: () => this.router.navigateByUrl('/usuarios'),
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje ?? 'Error al guardar.');
      }
    });
  }
}
