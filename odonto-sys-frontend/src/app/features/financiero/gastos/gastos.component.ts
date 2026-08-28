import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastoService } from '../../../core/services/gasto.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Gasto } from '../../../core/models/gasto.models';
import { CatGasto } from '../../../core/models/catalogo.models';
import { Usuario } from '../../../core/models/usuario.models';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function primerDiaDelMesIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-01`;
}

@Component({
  selector: 'app-gastos',
  imports: [ReactiveFormsModule],
  templateUrl: './gastos.component.html'
})
export class GastosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly gastoService = inject(GastoService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly items = signal<Gasto[]>([]);
  protected readonly tiposGasto = signal<CatGasto[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly filtros = this.fb.group({
    desde: [primerDiaDelMesIso()],
    hasta: [hoyIso()],
    idTipoGasto: [null as number | null]
  });

  protected readonly formulario = this.fb.group({
    descripcion: ['', Validators.required],
    monto: [null as number | null, Validators.required],
    fecha: [hoyIso(), Validators.required],
    comprobante: [''],
    idTipoGasto: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.catalogosService.tiposGasto().subscribe((datos) => this.tiposGasto.set(datos));
    this.usuarioService.listar().subscribe((datos) => this.usuarios.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    const valoresFiltro = this.filtros.getRawValue();
    const desde = valoresFiltro.desde ?? primerDiaDelMesIso();
    const hasta = valoresFiltro.hasta ?? hoyIso();

    this.gastoService.listarPorRango(desde, hasta, valoresFiltro.idTipoGasto).subscribe({
      next: (datos) => {
        this.items.set(datos.sort((a, b) => b.fecha.localeCompare(a.fecha)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    this.cargar();
  }

  nombreTipoGasto(id: number): string {
    return this.tiposGasto().find((t) => t.idTipoGasto === id)?.nombreCategoria ?? `#${id}`;
  }

  nombreUsuario(idUsuario: number): string {
    return this.usuarios().find((u) => u.idUsuario === idUsuario)?.nombre ?? `#${idUsuario}`;
  }

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({
      descripcion: '',
      monto: null,
      fecha: hoyIso(),
      comprobante: '',
      idTipoGasto: null
    });
    this.mostrarFormulario.set(true);
  }

  editar(item: Gasto): void {
    this.idEditando.set(item.idGasto);
    this.formulario.setValue({
      descripcion: item.descripcion,
      monto: item.monto,
      fecha: item.fecha,
      comprobante: item.comprobante ?? '',
      idTipoGasto: item.idTipoGasto
    });
    this.mostrarFormulario.set(true);
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
    this.idEditando.set(null);
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const request = {
      descripcion: valores.descripcion ?? '',
      monto: valores.monto as number,
      fecha: valores.fecha ?? '',
      comprobante: valores.comprobante || null,
      idTipoGasto: valores.idTipoGasto as number
    };

    const id = this.idEditando();
    const operacion = id ? this.gastoService.actualizar(id, request) : this.gastoService.crear(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: Gasto): void {
    if (!window.confirm('¿Desea eliminar este gasto?')) {
      return;
    }
    this.gastoService.eliminar(item.idGasto).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
