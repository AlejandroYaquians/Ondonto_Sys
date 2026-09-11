import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly formulario = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.authService.login(this.formulario.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.cargando.set(false);
        const mensaje = typeof err?.error === 'string' && err.error ? err.error : 'Usuario o contraseña incorrectos';
        this.error.set(mensaje);
      }
    });
  }
}
