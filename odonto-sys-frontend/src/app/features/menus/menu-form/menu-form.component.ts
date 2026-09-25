import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';
import { ModuloService } from '../../../core/services/modulo.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { MenuRequest } from '../../../core/models/menu.models';
import { Modulo } from '../../../core/models/modulo.models';

@Component({
  selector: 'app-menu-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './menu-form.component.html'
})
export class MenuFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly menuService = inject(MenuService);
  private readonly moduloService = inject(ModuloService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly idMenu = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly modulos = signal<Modulo[]>([]);

  protected readonly formulario = this.fb.group({
    nombre: ['', Validators.required],
    ruta: [''],
    orden: [0],
    idModulo: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.moduloService.listar().subscribe((datos) => this.modulos.set(datos));

    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idMenu.set(id);
      this.cargarMenu(id);
    }
  }

  private cargarMenu(id: number): void {
    this.cargando.set(true);
    this.menuService.buscarPorId(id).subscribe({
      next: (menu) => {
        this.formulario.patchValue({
          nombre: menu.nombre,
          ruta: menu.ruta ?? '',
          orden: menu.orden,
          idModulo: menu.idModulo
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const request: MenuRequest = {
      nombre: valores.nombre ?? '',
      ruta: valores.ruta || null,
      orden: valores.orden,
      idModulo: valores.idModulo as number
    };

    const id = this.idMenu();
    const operacion = id ? this.menuService.actualizar(id, request) : this.menuService.crear(request);

    operacion.subscribe({
      next: () => {
        this.notificacionService.exito(id ? 'Menú actualizado.' : 'Menú creado.');
        this.router.navigateByUrl('/menus');
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar.');
      }
    });
  }
}
