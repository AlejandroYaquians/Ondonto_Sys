import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { DoctorRequest } from '../../../core/models/doctor.models';
import { CatEspecialidad } from '../../../core/models/catalogo.models';
import { Usuario } from '../../../core/models/usuario.models';

@Component({
  selector: 'app-doctor-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './doctor-form.component.html'
})
export class DoctorFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly idDoctor = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly especialidades = signal<CatEspecialidad[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    telefono: [''],
    email: ['', Validators.email],
    porcentajeComision: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    idsEspecialidad: [[] as number[]],
    idUsuario: [null as number | null]
  });

  ngOnInit(): void {
    this.catalogosService.especialidades().subscribe((datos) => this.especialidades.set(datos));
    this.usuarioService.listar().subscribe((datos) => this.usuarios.set(datos));

    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idDoctor.set(id);
      this.cargarDoctor(id);
    }
  }

  private cargarDoctor(id: number): void {
    this.cargando.set(true);
    this.doctorService.buscarPorId(id).subscribe({
      next: (doctor) => {
        this.formulario.patchValue({
          nombre: doctor.nombre,
          apellido: doctor.apellido,
          telefono: doctor.telefono ?? '',
          email: doctor.email ?? '',
          porcentajeComision: doctor.porcentajeComision,
          idsEspecialidad: doctor.idsEspecialidad,
          idUsuario: doctor.idUsuario
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
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
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const request: DoctorRequest = {
      nombre: valores.nombre ?? '',
      apellido: valores.apellido ?? '',
      telefono: valores.telefono || null,
      email: valores.email || null,
      porcentajeComision: valores.porcentajeComision ?? 0,
      idsEspecialidad: valores.idsEspecialidad ?? [],
      idUsuario: valores.idUsuario
    };

    const id = this.idDoctor();
    const operacion = id ? this.doctorService.actualizar(id, request) : this.doctorService.crear(request);

    operacion.subscribe({
      next: () => this.router.navigateByUrl('/doctores'),
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar.');
      }
    });
  }
}
