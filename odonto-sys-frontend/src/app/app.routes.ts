import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permisoGuard } from './core/guards/permiso.guard';

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
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/perfil/perfil.component').then((m) => m.PerfilComponent)
      },
      {
        path: 'usuarios',
        canActivate: [permisoGuard('/usuarios', 'ver')],
        loadComponent: () =>
          import('./features/usuarios/usuario-list/usuario-list.component').then((m) => m.UsuarioListComponent)
      },
      {
        path: 'usuarios/nuevo',
        canActivate: [permisoGuard('/usuarios', 'crear')],
        loadComponent: () =>
          import('./features/usuarios/usuario-form/usuario-form.component').then((m) => m.UsuarioFormComponent)
      },
      {
        path: 'usuarios/:id/editar',
        canActivate: [permisoGuard('/usuarios', 'editar')],
        loadComponent: () =>
          import('./features/usuarios/usuario-form/usuario-form.component').then((m) => m.UsuarioFormComponent)
      },
      {
        path: 'permisos',
        canActivate: [permisoGuard('/permisos', 'ver')],
        loadComponent: () => import('./features/permisos/permisos.component').then((m) => m.PermisosComponent)
      },
      {
        path: 'menus',
        canActivate: [permisoGuard('/menus', 'ver')],
        loadComponent: () => import('./features/menus/menu-list/menu-list.component').then((m) => m.MenuListComponent)
      },
      {
        path: 'menus/nuevo',
        canActivate: [permisoGuard('/menus', 'crear')],
        loadComponent: () => import('./features/menus/menu-form/menu-form.component').then((m) => m.MenuFormComponent)
      },
      {
        path: 'menus/:id/editar',
        canActivate: [permisoGuard('/menus', 'editar')],
        loadComponent: () => import('./features/menus/menu-form/menu-form.component').then((m) => m.MenuFormComponent)
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
        path: 'pacientes/:id',
        loadComponent: () =>
          import('./features/pacientes/paciente-detalle/paciente-detalle.component').then(
            (m) => m.PacienteDetalleComponent
          )
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
      {
        path: 'citas/:id',
        loadComponent: () =>
          import('./features/citas/cita-detalle/cita-detalle.component').then((m) => m.CitaDetalleComponent)
      },
      {
        path: 'doctores',
        canActivate: [permisoGuard('/doctores', 'ver')],
        loadComponent: () =>
          import('./features/doctores/doctor-list/doctor-list.component').then((m) => m.DoctorListComponent)
      },
      {
        path: 'doctores/nuevo',
        canActivate: [permisoGuard('/doctores', 'crear')],
        loadComponent: () =>
          import('./features/doctores/doctor-form/doctor-form.component').then((m) => m.DoctorFormComponent)
      },
      {
        path: 'doctores/:id/editar',
        canActivate: [permisoGuard('/doctores', 'editar')],
        loadComponent: () =>
          import('./features/doctores/doctor-form/doctor-form.component').then((m) => m.DoctorFormComponent)
      },
      {
        path: 'doctores/:id',
        loadComponent: () =>
          import('./features/doctores/doctor-detalle/doctor-detalle.component').then((m) => m.DoctorDetalleComponent)
      },
      {
        path: 'historial-clinico/nueva',
        loadComponent: () =>
          import('./features/historial-clinico/historial-clinico-form/historial-clinico-form.component').then(
            (m) => m.HistorialClinicoFormComponent
          )
      },
      {
        path: 'historial-clinico/:id',
        loadComponent: () =>
          import('./features/historial-clinico/historial-clinico-detalle/historial-clinico-detalle.component').then(
            (m) => m.HistorialClinicoDetalleComponent
          )
      },
      {
        path: 'catalogos/afecciones',
        canActivate: [permisoGuard('/catalogos/afecciones', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/afecciones/afecciones.component').then((m) => m.AfeccionesComponent)
      },
      {
        path: 'catalogos/motivos-cita',
        canActivate: [permisoGuard('/catalogos/motivos-cita', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/motivos-cita/motivos-cita.component').then((m) => m.MotivosCitaComponent)
      },
      {
        path: 'catalogos/especialidades',
        canActivate: [permisoGuard('/catalogos/especialidades', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/especialidades/especialidades.component').then((m) => m.EspecialidadesComponent)
      },
      {
        path: 'catalogos/tipos-gasto',
        canActivate: [permisoGuard('/catalogos/tipos-gasto', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/tipos-gasto/tipos-gasto.component').then((m) => m.TiposGastoComponent)
      },
      {
        path: 'catalogos/generos',
        canActivate: [permisoGuard('/catalogos/generos', 'ver')],
        loadComponent: () => import('./features/catalogos/generos/generos.component').then((m) => m.GenerosComponent)
      },
      {
        path: 'catalogos/metodos-pago',
        canActivate: [permisoGuard('/catalogos/metodos-pago', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/metodos-pago/metodos-pago.component').then((m) => m.MetodosPagoComponent)
      },
      {
        path: 'catalogos/parentescos',
        canActivate: [permisoGuard('/catalogos/parentescos', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/parentescos/parentescos.component').then((m) => m.ParentescosComponent)
      },
      {
        path: 'catalogos/profesiones',
        canActivate: [permisoGuard('/catalogos/profesiones', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/profesiones/profesiones.component').then((m) => m.ProfesionesComponent)
      },
      {
        path: 'departamentos',
        canActivate: [permisoGuard('/departamentos', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/departamentos/departamentos.component').then((m) => m.DepartamentosComponent)
      },
      {
        path: 'municipios',
        canActivate: [permisoGuard('/municipios', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/municipios/municipios.component').then((m) => m.MunicipiosComponent)
      },
      {
        path: 'servicios',
        canActivate: [permisoGuard('/servicios', 'ver')],
        loadComponent: () =>
          import('./features/catalogos/servicios/servicios.component').then((m) => m.ServiciosComponent)
      },
      {
        path: 'instrumental',
        loadComponent: () =>
          import('./features/inventario/inventario-list/inventario-list.component').then(
            (m) => m.InventarioListComponent
          )
      },
      {
        path: 'instrumental/nuevo',
        loadComponent: () =>
          import('./features/inventario/inventario-form/inventario-form.component').then(
            (m) => m.InventarioFormComponent
          )
      },
      {
        path: 'instrumental/:id/editar',
        loadComponent: () =>
          import('./features/inventario/inventario-form/inventario-form.component').then(
            (m) => m.InventarioFormComponent
          )
      },
      {
        path: 'instrumental/:id/entrada',
        data: { esEntrada: true },
        loadComponent: () =>
          import('./features/inventario/inventario-movimiento/inventario-movimiento.component').then(
            (m) => m.InventarioMovimientoComponent
          )
      },
      {
        path: 'instrumental/:id/salida',
        data: { esEntrada: false },
        loadComponent: () =>
          import('./features/inventario/inventario-movimiento/inventario-movimiento.component').then(
            (m) => m.InventarioMovimientoComponent
          )
      },
      {
        path: 'instrumental/:id/historial',
        loadComponent: () =>
          import('./features/inventario/inventario-historial/inventario-historial.component').then(
            (m) => m.InventarioHistorialComponent
          )
      },
      {
        path: 'financiero/dashboard',
        loadComponent: () =>
          import('./features/financiero/dashboard/dashboard-financiero.component').then(
            (m) => m.DashboardFinancieroComponent
          )
      },
      {
        path: 'financiero/pago-comisiones',
        loadComponent: () =>
          import('./features/financiero/pago-comisiones/pago-comisiones-list/pago-comisiones-list.component').then(
            (m) => m.PagoComisionesListComponent
          )
      },
      {
        path: 'financiero/pago-comisiones/:idDoctor',
        loadComponent: () =>
          import('./features/financiero/pago-comisiones/pago-comisiones-detalle/pago-comisiones-detalle.component').then(
            (m) => m.PagoComisionesDetalleComponent
          )
      },
      {
        path: 'financiero/pago-comisiones/:idDoctor/registrar',
        loadComponent: () =>
          import(
            './features/financiero/pago-comisiones/pago-comisiones-registrar/pago-comisiones-registrar.component'
          ).then((m) => m.PagoComisionesRegistrarComponent)
      },
      {
        path: 'financiero/pago-comisiones/:idDoctor/historial',
        loadComponent: () =>
          import(
            './features/financiero/pago-comisiones/pago-comisiones-historial/pago-comisiones-historial.component'
          ).then((m) => m.PagoComisionesHistorialComponent)
      },
      {
        path: 'gastos',
        loadComponent: () => import('./features/financiero/gastos/gastos.component').then((m) => m.GastosComponent)
      },
      {
        path: 'cobros',
        loadComponent: () =>
          import('./features/financiero/cobros/cobro-list/cobro-list.component').then((m) => m.CobroListComponent)
      },
      {
        path: 'cobros/nuevo',
        loadComponent: () =>
          import('./features/financiero/cobros/cobro-form/cobro-form.component').then((m) => m.CobroFormComponent)
      },
      {
        path: 'cobros/:id',
        loadComponent: () =>
          import('./features/financiero/cobros/cobro-detalle/cobro-detalle.component').then(
            (m) => m.CobroDetalleComponent
          )
      },
      {
        path: 'bitacora',
        canActivate: [permisoGuard('/bitacora', 'ver')],
        loadComponent: () => import('./features/bitacora/bitacora.component').then((m) => m.BitacoraComponent)
      },
      {
        path: 'bitacora/:id',
        canActivate: [permisoGuard('/bitacora', 'ver')],
        loadComponent: () =>
          import('./features/bitacora/bitacora-detalle/bitacora-detalle.component').then(
            (m) => m.BitacoraDetalleComponent
          )
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
