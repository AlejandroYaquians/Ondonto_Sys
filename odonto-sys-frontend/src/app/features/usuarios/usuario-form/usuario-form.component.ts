import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { RolService } from '../../../core/services/rol.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { UsuarioRequest } from '../../../core/models/usuario.models';
import { Rol } from '../../../core/models/rol.models';
import { CatEspecialidad } from '../../../core/models/catalogo.models';

const ROL_DOCTOR = 'DOCTOR';

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) {
    return null;
  }
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(valor) ? null : { pattern: true };
}

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
  private readonly notificacionService = inject(NotificacionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly idUsuario = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly roles = signal<Rol[]>([]);
  protected readonly especialidades = signal<CatEspecialidad[]>([]);
  protected readonly mostrarPassword = signal(false);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', passwordValidator],
    idRol: [null as number | null, Validators.required],
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
          apellido: usuario.apellido ?? '',
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

  toggleMostrarPassword(): void {
    this.mostrarPassword.update((actual) => !actual);
  }

  especialidadSeleccionada(idEspecialidad: number): boolean {
    return (this.formulario.controls.idsEspecialidad.value ?? []).includes(idEspecialidad);
  }

  toggleEspecialidad(idEspecialidad: number): void {
    const actuales = this.formulario.controls.idsEspecialidad.value ?? [];
    const nuevas = actuales.includes(idEspecialidad)
      ? actuales.filter((id) => id !== idEspecialidad)
      : [...actuales, idEspecialidad];
    this.formulario.patchValue({ idsEspecialidad: nuevas });
  }

  onSubmit(): void {
    const valores = this.formulario.getRawValue();

    if (this.esNuevo() && !valores.password) {
      this.formulario.controls.password.setErrors({ required: true });
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const request: UsuarioRequest = {
      nombre: valores.nombre ?? '',
      apellido: valores.apellido ?? '',
      username: valores.username ?? '',
      password: valores.password || null,
      idRol: valores.idRol as number,
      porcentajeComision: this.mostrarCamposDoctor() ? valores.porcentajeComision : null,
      idsEspecialidad: this.mostrarCamposDoctor() ? valores.idsEspecialidad : null
    };

    const id = this.idUsuario();
    const operacion = id ? this.usuarioService.actualizar(id, request) : this.usuarioService.crear(request);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(id ? 'Usuario actualizado.' : 'Usuario creado.');
        this.router.navigateByUrl('/usuarios');
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje ?? 'Error al guardar.');
      }
    });
  }
}
