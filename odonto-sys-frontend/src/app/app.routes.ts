import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'menu',
        loadComponent: () => import('./features/menu/menu.component').then((m) => m.MenuComponent)
      },
      {
        path: 'pacientes',
        loadComponent: () =>
          import('./features/pacientes/paciente-list/paciente-list.component').then((m) => m.PacienteListComponent)
      },
      {
        path: 'pacientes/nuevo',
        loadComponent: () =>
          import('./features/pacientes/paciente-form/paciente-form.component').then((m) => m.PacienteFormComponent)
      },
      {
        path: 'pacientes/:id/editar',
        loadComponent: () =>
          import('./features/pacientes/paciente-form/paciente-form.component').then((m) => m.PacienteFormComponent)
      },
      {
        path: 'citas',
        loadComponent: () => import('./features/citas/cita-list/cita-list.component').then((m) => m.CitaListComponent)
      },
      {
        path: 'citas/nueva',
        loadComponent: () => import('./features/citas/cita-form/cita-form.component').then((m) => m.CitaFormComponent)
      },
      {
        path: 'citas/:id/editar',
        loadComponent: () => import('./features/citas/cita-form/cita-form.component').then((m) => m.CitaFormComponent)
      },
      { path: '', pathMatch: 'full', redirectTo: 'menu' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
