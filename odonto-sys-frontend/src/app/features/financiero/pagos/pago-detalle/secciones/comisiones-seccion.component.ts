import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComisionService } from '../../../../../core/services/comision.service';
import { DoctorService } from '../../../../../core/services/doctor.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Comision } from '../../../../../core/models/pago.models';
import { Doctor } from '../../../../../core/models/doctor.models';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-comisiones-seccion',
  imports: [ReactiveFormsModule],
  templateUrl: './comisiones-seccion.component.html'
})
export class ComisionesSeccionComponent implements OnInit {
  @Input({ required: true }) idPago!: number;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ComisionService);
  private readonly doctorService = inject(DoctorService);
  private readonly authService = inject(AuthService);

  protected readonly items = signal<Comision[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);

  protected readonly formulario = this.fb.group({
    idDoctor: [null as number | null, Validators.required],
    montoBase: [null as number | null, Validators.required],
    porcentajeAplicado: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.service.listarPorPago(this.idPago).subscribe({
      next: (datos) => {
        this.items.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreDoctor(id: number): string {
    const doctor = this.doctores().find((d) => d.idDoctor === id);
    return doctor ? `Dr(a). ${doctor.nombre} ${doctor.apellido}` : `#${id}`;
  }

  nuevo(): void {
    this.formulario.reset({ idDoctor: null, montoBase: null, porcentajeAplicado: null });
    this.mostrarFormulario.set(true);
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const montoBase = valores.montoBase as number;
    const porcentajeAplicado = valores.porcentajeAplicado as number;
    const montoComision = Math.round(montoBase * (porcentajeAplicado / 100) * 100) / 100;

    const request = {
      idDoctor: valores.idDoctor as number,
      montoBase,
      porcentajeAplicado,
      montoComision,
      fecha: hoyIso(),
      idPago: this.idPago,
      idUsuarioCreacion: this.authService.idUsuario()
    };

    this.service.crear(request).subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  cambiarEstado(item: Comision, estado: string): void {
    this.service.cambiarEstado(item.idComision, estado).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: Comision): void {
    if (!window.confirm('¿Desea eliminar esta comisión?')) {
      return;
    }
    this.service.eliminar(item.idComision).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
