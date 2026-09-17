import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccesoService } from '../services/acceso.service';

export function permisoGuard(ruta: string, accion: 'ver' | 'crear' | 'editar' = 'ver'): CanActivateFn {
  return () => {
    const accesoService = inject(AccesoService);
    const router = inject(Router);

    const autorizado =
      accion === 'crear'
        ? accesoService.puedeCrear(ruta)
        : accion === 'editar'
          ? accesoService.puedeEditar(ruta)
          : accesoService.puedeVer(ruta);

    if (autorizado) {
      return true;
    }

    router.navigateByUrl('/dashboard');
    return false;
  };
}
