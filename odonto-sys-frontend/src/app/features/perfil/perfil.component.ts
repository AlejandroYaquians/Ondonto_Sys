import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilService } from '../../core/services/perfil.service';
import { Perfil } from '../../core/models/perfil.models';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly perfilService = inject(PerfilService);

  protected readonly perfil = signal<Perfil | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly mostrarFormulario = signal(false);
  protected readonly guardando = signal(false);
  protected readonly errorPassword = signal<string | null>(null);
  protected readonly exitoPassword = signal(false);

  protected readonly mostrarPasswordActual = signal(false);
  protected readonly mostrarPasswordNueva = signal(false);
  protected readonly mostrarConfirmarPassword = signal(false);

  protected readonly formulario = this.fb.group({
    passwordActual: ['', Validators.required],
    passwordNueva: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    confirmarPassword: ['', Validators.required]
  });

  ngOnInit(): void {
    this.perfilService.obtenerPerfil().subscribe({
      next: (datos) => {
        this.perfil.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update((actual) => !actual);
    this.errorPassword.set(null);
    this.exitoPassword.set(false);
    this.formulario.reset({ passwordActual: '', passwordNueva: '', confirmarPassword: '' });
  }

  toggleMostrarPasswordActual(): void {
    this.mostrarPasswordActual.update((actual) => !actual);
  }

  toggleMostrarPasswordNueva(): void {
    this.mostrarPasswordNueva.update((actual) => !actual);
  }

  toggleMostrarConfirmarPassword(): void {
    this.mostrarConfirmarPassword.update((actual) => !actual);
  }

  guardarPassword(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    if (valores.passwordNueva !== valores.confirmarPassword) {
      this.errorPassword.set('Las contraseñas nuevas no coinciden.');
      return;
    }

    this.guardando.set(true);
    this.errorPassword.set(null);
    this.exitoPassword.set(false);

    this.perfilService
      .cambiarPassword({
        passwordActual: valores.passwordActual ?? '',
        passwordNueva: valores.passwordNueva ?? ''
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.exitoPassword.set(true);
          this.mostrarFormulario.set(false);
        },
        error: (err) => {
          this.guardando.set(false);
          this.errorPassword.set(err?.error?.mensaje ?? 'Error al guardar.');
        }
      });
  }
}
