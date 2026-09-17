import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AccesoService } from '../services/acceso.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const accesoService = inject(AccesoService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigateByUrl('/login');
    return false;
  }

  if (accesoService.estaCargado()) {
    return true;
  }

  return accesoService.cargar().pipe(
    map(() => true),
    catchError(() => {
      router.navigateByUrl('/login');
      return of(false);
    })
  );
};
