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
        path: 'doctores',
        loadComponent: () =>
          import('./features/doctores/doctor-list/doctor-list.component').then((m) => m.DoctorListComponent)
      },
      {
        path: 'doctores/nuevo',
        loadComponent: () =>
          import('./features/doctores/doctor-form/doctor-form.component').then((m) => m.DoctorFormComponent)
      },
      {
        path: 'doctores/:id/editar',
        loadComponent: () =>
          import('./features/doctores/doctor-form/doctor-form.component').then((m) => m.DoctorFormComponent)
      },
      {
        path: 'consultas',
        loadComponent: () =>
          import('./features/consultas/consulta-list/consulta-list.component').then((m) => m.ConsultaListComponent)
      },
      {
        path: 'consultas/nueva',
        loadComponent: () =>
          import('./features/consultas/consulta-form/consulta-form.component').then((m) => m.ConsultaFormComponent)
      },
      {
        path: 'consultas/:id/editar',
        loadComponent: () =>
          import('./features/consultas/consulta-form/consulta-form.component').then((m) => m.ConsultaFormComponent)
      },
      {
        path: 'consultas/:id',
        loadComponent: () =>
          import('./features/consultas/consulta-detalle/consulta-detalle.component').then((m) => m.ConsultaDetalleComponent)
      },
      {
        path: 'catalogos/afecciones',
        loadComponent: () =>
          import('./features/catalogos/afecciones/afecciones.component').then((m) => m.AfeccionesComponent)
      },
      {
        path: 'catalogos/diagnosticos',
        loadComponent: () =>
          import('./features/catalogos/diagnosticos/diagnosticos.component').then((m) => m.DiagnosticosComponent)
      },
      {
        path: 'catalogos/especialidades',
        loadComponent: () =>
          import('./features/catalogos/especialidades/especialidades.component').then((m) => m.EspecialidadesComponent)
      },
      {
        path: 'catalogos/estados-cita',
        loadComponent: () =>
          import('./features/catalogos/estados-cita/estados-cita.component').then((m) => m.EstadosCitaComponent)
      },
      {
        path: 'catalogos/tipos-gasto',
        loadComponent: () =>
          import('./features/catalogos/tipos-gasto/tipos-gasto.component').then((m) => m.TiposGastoComponent)
      },
      {
        path: 'catalogos/generos',
        loadComponent: () => import('./features/catalogos/generos/generos.component').then((m) => m.GenerosComponent)
      },
      {
        path: 'catalogos/metodos-pago',
        loadComponent: () =>
          import('./features/catalogos/metodos-pago/metodos-pago.component').then((m) => m.MetodosPagoComponent)
      },
      {
        path: 'catalogos/tipos-movimiento',
        loadComponent: () =>
          import('./features/catalogos/tipos-movimiento/tipos-movimiento.component').then(
            (m) => m.TiposMovimientoComponent
          )
      },
      {
        path: 'catalogos/parentescos',
        loadComponent: () =>
          import('./features/catalogos/parentescos/parentescos.component').then((m) => m.ParentescosComponent)
      },
      {
        path: 'catalogos/profesiones',
        loadComponent: () =>
          import('./features/catalogos/profesiones/profesiones.component').then((m) => m.ProfesionesComponent)
      },
      {
        path: 'catalogos/tratamientos',
        loadComponent: () =>
          import('./features/catalogos/tratamientos/tratamientos.component').then((m) => m.TratamientosComponent)
      },
      {
        path: 'departamentos',
        loadComponent: () =>
          import('./features/catalogos/departamentos/departamentos.component').then((m) => m.DepartamentosComponent)
      },
      {
        path: 'municipios',
        loadComponent: () =>
          import('./features/catalogos/municipios/municipios.component').then((m) => m.MunicipiosComponent)
      },
      {
        path: 'servicios',
        loadComponent: () =>
          import('./features/catalogos/servicios/servicios.component').then((m) => m.ServiciosComponent)
      },
      {
        path: 'insumos',
        loadComponent: () => import('./features/inventario/insumos/insumos.component').then((m) => m.InsumosComponent)
      },
      {
        path: 'insumo-movimientos',
        loadComponent: () =>
          import('./features/inventario/insumo-movimientos/insumo-movimientos.component').then(
            (m) => m.InsumoMovimientosComponent
          )
      },
      {
        path: 'insumo-servicios',
        loadComponent: () =>
          import('./features/inventario/insumo-servicios/insumo-servicios.component').then(
            (m) => m.InsumoServiciosComponent
          )
      },
      {
        path: 'gastos',
        loadComponent: () => import('./features/financiero/gastos/gastos.component').then((m) => m.GastosComponent)
      },
      {
        path: 'pagos',
        loadComponent: () =>
          import('./features/financiero/pagos/pago-list/pago-list.component').then((m) => m.PagoListComponent)
      },
      {
        path: 'pagos/nuevo',
        loadComponent: () =>
          import('./features/financiero/pagos/pago-form/pago-form.component').then((m) => m.PagoFormComponent)
      },
      {
        path: 'pagos/:id/editar',
        loadComponent: () =>
          import('./features/financiero/pagos/pago-form/pago-form.component').then((m) => m.PagoFormComponent)
      },
      {
        path: 'pagos/:id',
        loadComponent: () =>
          import('./features/financiero/pagos/pago-detalle/pago-detalle.component').then(
            (m) => m.PagoDetalleComponent
          )
      },
      {
        path: 'bitacora',
        loadComponent: () => import('./features/bitacora/bitacora.component').then((m) => m.BitacoraComponent)
      },
      { path: '', pathMatch: 'full', redirectTo: 'menu' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
