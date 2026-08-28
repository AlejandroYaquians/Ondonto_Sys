import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ComisionService } from '../../../core/services/comision.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Comision } from '../../../core/models/cobro.models';
import { Doctor } from '../../../core/models/doctor.models';

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
  selector: 'app-comisiones',
  imports: [ReactiveFormsModule],
  templateUrl: './comisiones.component.html'
})
export class ComisionesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly comisionService = inject(ComisionService);
  private readonly doctorService = inject(DoctorService);
  private readonly authService = inject(AuthService);

  protected readonly esAdmin = computed(() => this.authService.rol() === 'ADMIN');

  protected readonly items = signal<Comision[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly filtros = this.fb.group({
    desde: [primerDiaDelMesIso()],
    hasta: [hoyIso()],
    idDoctor: [null as number | null]
  });

  ngOnInit(): void {
    this.doctorService.listarActivos().subscribe((datos) => this.doctores.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    const valores = this.filtros.getRawValue();
    const desde = valores.desde ?? primerDiaDelMesIso();
    const hasta = valores.hasta ?? hoyIso();

    this.comisionService.listarPorRango(desde, hasta, valores.idDoctor).subscribe({
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

  nombreDoctor(id: number): string {
    const doctor = this.doctores().find((d) => d.idDoctor === id);
    return doctor ? `${doctor.nombre} ${doctor.apellido}` : `#${id}`;
  }

  marcarPagada(item: Comision): void {
    this.comisionService.cambiarEstado(item.idComision, 'pagada').subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al guardar.')
    });
  }
}
